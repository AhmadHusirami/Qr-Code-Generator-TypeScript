import html2canvas from 'html2canvas';
import { useRef, useState } from 'react';
import { QRCode } from 'react-qrcode-logo';
import { Box, Button, Flex, Heading, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { IoSaveOutline } from 'react-icons/io5';
import { FaQrcode } from 'react-icons/fa6';
import { useImageUploadStore } from './store/useImageUpload';
import { useQrOptionsStore } from './store/useQrOptionStore';
import { useColorPicker } from './store/useQrColorPicker';
import { useQrValue } from './hooks/useQrValue';
import { Toaster, toast } from 'react-hot-toast';

import ImageFileUpload from './components/ImageFileUpload';
import QrOptions from './components/QrOptions';


export default function App() {
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const qrValue = useQrValue();
  const option = useQrOptionsStore();
  const image = useImageUploadStore();
  const color = useColorPicker();

  const [isQrCodeVisible, setQrCodeVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const saveAsImage = () => {
    if (qrCodeRef.current) {
      html2canvas(qrCodeRef.current, {
        scale: 4, // Increase this for better quality
        useCORS: true, // Use CORS for external resources
        logging: true, // Enable logging for debugging
        // Optionally you can set other options here
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'qrcode.png';
        link.click();
  
        toast.success('QR Code saved successfully!');
      });
    }
  };
  

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    qrValue.handleQrChange(event);
    setQrCodeVisible(value.trim().length > 0);
  };

  const currentYear = new Date().getFullYear(); 

  return (
    <>
      <Toaster />
      <Heading fontWeight="semibold" mb={4}>
        QR Code Generator
      </Heading>
      <Flex flexWrap="wrap" justifyContent="center" className="bg-slate-300" p={16} gap={12}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={6} px={6} maxWidth={400}>
          <Heading as="h2" size="sm">
            Preview
          </Heading>
          {isQrCodeVisible && (
            <Box ref={qrCodeRef}>
              <QRCode
                value={qrValue.value as string}
                qrStyle={option.qrOptions.qrStyle}
                bgColor={color.bgColor}
                fgColor={color.fgColor}
                logoImage={image.currentImage ? image.currentImage : undefined}
                logoWidth={option.qrOptions.width}
                logoHeight={option.qrOptions.height}
                ecLevel={option.qrOptions.ecLevel}
                removeQrCodeBehindLogo={true}
                logoPadding={option.qrOptions.logoPadding}
                logoPaddingStyle={option.qrOptions.logoPaddingStyle}
                eyeRadius={option.qrOptions.eyeRadius}
                eyeColor={color.eyeColor}
                size={220}
              />
            </Box>
          )}
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FaQrcode color="gray.300" />
            </InputLeftElement>
            <Input placeholder="Enter QR Content..." variant="filled" type="text" onChange={handleInputChange} />
          </InputGroup>
          <ImageFileUpload name="imageFile" acceptedFileTypes="image/*" isRequired={true} imageName={image.imageName} onImageChange={image.handleImageChange} currentImage={image.currentImage} removeImage={image.removeImage} isDisabled={inputValue.trim().length === 0}  backgroundColor={inputValue.trim().length === 0 ? "gray.200" : "blue.490"}>
            Choose Image
          </ImageFileUpload>
          <Button width="full" leftIcon={<IoSaveOutline />} onClick={saveAsImage} colorScheme={inputValue.trim().length === 0 ? "gray" : "blue"} color="black" mt="2" isDisabled={inputValue.trim().length === 0}>
            Save QR Code
          </Button>
        </Box>
        <Box gap="6">
          <Heading display="flex" mb={2} as="h2" size="sm">
            Customize
          </Heading>
          <QrOptions />
        </Box>
      </Flex>
      <Flex justifyContent="center" mt={4}>
        <Box>Copy Right © {currentYear} <a href="https://ahmad-husirami.vercel.app/" target="_blank" rel="noreferrer">Ahmad Said Husirami</a></Box>
      </Flex>
    </>
  );
}

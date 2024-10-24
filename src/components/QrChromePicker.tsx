import { useState, useRef, useEffect } from 'react';
import { Button, Flex } from '@chakra-ui/react';
import { useColorPicker } from '../store/useQrColorPicker';
import { IoColorWandOutline, IoColorWand, IoColorWandSharp } from 'react-icons/io5';
import { ChromePicker, ColorResult } from 'react-color'; // Import the proper types from 'react-color'

// Define the types for 'currentPicker' and 'colorOptions'
type currentPickerType = 'bgColor' | 'fgColor' | 'eyeColor' | null;

export default function QrChromePicker() {
  const [showPicker, setShowPicker] = useState(false);
  const [currentPicker, setCurrentPicker] = useState<currentPickerType>(null); // Typed to 'currentPickerType'
  const colorPicker = useColorPicker();
  const pickerRef = useRef<HTMLDivElement | null>(null); // Typed ref for div

  const colorOptions = [
    {
      id: 1,
      variant: 'bgColor' as const, // Specify the type of the variant explicitly
      variantName: 'BG Color',
      icon: <IoColorWandOutline />,
      color: colorPicker.bgColor,
      onChange: (color: ColorResult) => colorPicker.changeBgColor(color.hex), // Explicitly define type of 'color'
    },
    {
      id: 2,
      variant: 'fgColor' as const,
      variantName: 'FG Color',
      icon: <IoColorWand />,
      color: colorPicker.fgColor,
      onChange: (color: ColorResult) => colorPicker.changeFgColor(color.hex),
    },
    {
      id: 3,
      variant: 'eyeColor' as const,
      variantName: 'Eye Color',
      icon: <IoColorWandSharp />,
      color: colorPicker.eyeColor,
      onChange: (color: ColorResult) => colorPicker.changeEyeColor(color.hex),
    },
  ];

  const togglePicker = (content: currentPickerType) => {
    if (!currentPicker && !showPicker) {
      setCurrentPicker(content);
      setShowPicker(true);
    } else if (currentPicker === content && showPicker) {
      setCurrentPicker(null);
      setShowPicker(false);
    } else {
      setCurrentPicker(content);
    }
  };

  useEffect(() => {
    if (showPicker && pickerRef.current) {
      const pickerBox = pickerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // Reposition picker if it's out of the viewport on the right or left
      if (pickerBox.right > viewportWidth) {
        pickerRef.current.style.right = '0px';
        pickerRef.current.style.left = 'auto';
      }
      if (pickerBox.left < 0) {
        pickerRef.current.style.left = '0px';
        pickerRef.current.style.right = 'auto';
      }
    }
  }, [showPicker]);

  return (
    <Flex justifyContent="center" alignItems="center" gap={2} mb={2}>
      {colorOptions.map((item) => {
        const isActive = currentPicker === item.variant && showPicker;
        const handlePicker = () => togglePicker(item.variant);

        return (
          <div key={item.id} className="relative">
            <Button
              maxWidth={84}
              leftIcon={item.icon}
              variant={isActive ? 'outline' : 'solid'}
              border={isActive ? '1px' : 'hidden'}
              borderColor={isActive ? 'blue.500' : undefined}
              colorScheme="blue"
              color="black"
              size="xs"
              onClick={handlePicker}
            >
              {item.variantName}
            </Button>

            {showPicker && currentPicker === item.variant && (
              <div
                ref={pickerRef}
                className="absolute z-[999] top-10 right-0"
                style={{ position: 'absolute', zIndex: 999 }}
              >
                <ChromePicker color={item.color} onChange={item.onChange} />
              </div>
            )}
          </div>
        );
      })}
    </Flex>
  );
}

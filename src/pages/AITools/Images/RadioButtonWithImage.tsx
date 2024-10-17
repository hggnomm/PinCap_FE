import React, { useEffect, useState } from "react";

// Định nghĩa kiểu cho props
interface RadioButtonWithImageProps {
  onSelect: (value: { size: { width: number; height: number }; style_preset: string }) => void;
}

// Thay thế với dữ liệu thực tế của bạn
const options = [
  { style_preset: 'preset1', value: 'value1', label: 'Option 1', image: '/path/to/image1.png' },
  { style_preset: 'preset2', value: 'value2', label: 'Option 2', image: '/path/to/image2.png' },
  // Thêm các tùy chọn khác tại đây...
];

const sizeOptions = [
  { value: 'small', label: 'Small', image: '/path/to/size-image1.png' },
  { value: 'medium', label: 'Medium', image: '/path/to/size-image2.png' },
  // Thêm các kích thước khác tại đây...
];

const RadioButtonWithImage: React.FC<RadioButtonWithImageProps> = ({ onSelect }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const [selectedValue, setSelectedValue] = useState<{
    size: {
      width: number;
      height: number;
    };
    style_preset: string;
  }>({
    size: {
      width: 512,
      height: 512,
    },
    style_preset: "",
  });

  useEffect(() => {
    if (selectedType !== null && selectedSize !== null) {
      onSelect({
        ...selectedValue,
      });
    }
  }, [selectedType, selectedSize]);

  const handleRadioChangeType = (value: string) => {
    setSelectedValue({
      ...selectedValue,
      style_preset: value,
    });
    setSelectedType(value);
  };

  const handleRadioChangeSize = (value: string) => {
    const size = value === 'small' ? { width: 256, height: 256 } : value === 'medium' ? { width: 512, height: 512 } : { width: 1024, height: 1024 };
    setSelectedValue({
      ...selectedValue,
      size,
    });
    setSelectedSize(value);
  };

  return (
    <div>
      <div style={styles.radioGroup}>
        {options.map((option) => (
          <div style={styles.optionContainer} key={option.value}>
            <button
              style={{
                ...styles.radioButton,
                borderColor: selectedType === option.value ? 'white' : 'transparent',
              }}
              onClick={() => handleRadioChangeType(option.value)}
            >
              <img src={option.image} alt={option.label} style={styles.image} />
            </button>
            <span style={styles.selectedValueText}>{option.label}</span>
          </div>
        ))}
      </div>
      <div style={styles.radioGroup}>
        {sizeOptions.map((option) => (
          <div style={styles.optionContainer} key={option.value}>
            <button
              style={{
                ...styles.radioButton,
                borderColor: selectedSize === option.value ? 'white' : 'transparent',
              }}
              onClick={() => handleRadioChangeSize(option.value)}
            >
              <img src={option.image} alt={option.label} style={styles.image} />
            </button>
            <span style={styles.selectedValueText}>{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  radioGroup: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '10px 0',
    overflowX: 'auto',
  },
  optionContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '0 5px',
  },
  radioButton: {
    padding: '10px',
    borderWidth: 2,
    borderRadius: '10px',
    backgroundColor: 'transparent',
  },
  image: {
    width: '75px',
    height: '75px',
    borderRadius: '10px',
  },
  selectedValueText: {
    color: 'white',
    marginTop: '5px',
    fontSize: '12px',
    textAlign: 'center',
  },
};

export default RadioButtonWithImage;

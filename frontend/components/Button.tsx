import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { PRIMARY_LIGHT } from "@/utils/constants";

export type ButtonVariant = "primary" | "destructive" | "secondary";

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  style,
  textStyle,
  testID,
}) => {
  const getButtonStyles = (pressed: boolean): ViewStyle => {
    const baseStyle: ViewStyle = {
      justifyContent: "center",
      alignItems: "center",
      height: 40,
      minWidth: 100,
      paddingHorizontal: 20,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowRadius: 2,
      elevation: 2,
      opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
    };

    switch (variant) {
      case "destructive":
        return {
          ...baseStyle,
          backgroundColor: "#ef4444",
          shadowOpacity: 0.08,
        };
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: "#6b7280",
          shadowOpacity: 0.08,
        };
      case "primary":
      default:
        return {
          ...baseStyle,
          backgroundColor: PRIMARY_LIGHT,
          shadowOpacity: 0.1,
        };
    }
  };

  const getTextStyles = (): TextStyle => {
    return {
      color: "#fff",
      fontSize: 15,
      fontWeight: "600",
    };
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [getButtonStyles(pressed), style]}
      testID={testID}
    >
      <Text style={[getTextStyles(), textStyle]}>{title}</Text>
    </Pressable>
  );
};

export default Button;

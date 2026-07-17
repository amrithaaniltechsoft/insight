"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  children?: ReactNode;
}

export default function Button({
  variant = "primary",
  icon,
  iconPosition = "left",
  children,
  className = "",
  ...props
}: ButtonProps) {
  // Base styles include the 'group' class necessary to trigger the hover animation
  const baseStyles = "group cursor-pointer rounded-full font-body text-[15px] font-semibold transition-all active:scale-95 inline-flex justify-center";
  
  const isIconOnly = !children && !!icon;

  // Mapped your requested styling to our design system variables
  const variants = {
    primary: `bg-gradient-to-b from-[#5839E8] to-[#2D10AD] hover:brightness-105 border border-white text-[#FCFAFD] font-bold ${
      isIconOnly ? "p-3 aspect-square flex items-center justify-center" : "px-7 py-3.5"
    }`,
    secondary: `bg-white border border-[#2D2136] text-[#2D2136] hover:border-[#F000E2] hover:text-[#F000E2] ${
      isIconOnly ? "p-3 aspect-square flex items-center justify-center" : "px-7 py-3.5"
    }`,
    tertiary: `bg-transparent text-[#2D2136] hover:bg-[#2D2136]/5 ${
      isIconOnly ? "p-3 aspect-square flex items-center justify-center" : "px-4 py-3.5"
    }`,
  };

  // Extracting the inner content into a variable to keep the JSX clean during duplication
  const innerContent = (
    <>
      {icon && iconPosition === "left" && <span className="flex items-center">{icon}</span>}
      {children && <span>{children}</span>}
      {icon && iconPosition === "right" && <span className="flex items-center">{icon}</span>}
    </>
  );

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {/* 
        The relative wrapper with overflow-hidden handles the mask.
        We use a fixed height line-height block so the transform calculations 
        are pixel-perfect regardless of the font size. 
      */}
      <div className="relative flex items-center justify-center overflow-hidden">
        
        {/* Golden Shine Glare - only for primary variant */}
        {variant === "primary" && (
          <motion.span 
            className="absolute top-0 left-0 z-10 h-full w-1/2 -skew-x-[30deg] bg-gradient-to-r from-transparent via-white/80 to-transparent" 
            initial={{ x: "-150%" }}
            animate={{ x: "250%" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 2.5,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Default State: Slides UP and OUT on hover */}
        <div className="flex items-center gap-2 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-10">
          {innerContent}
        </div>
        
        {/* Hover State: Starts DOWN and OUT, slides UP and IN on hover */}
        <div className="absolute top-10 left-0 flex w-full items-center justify-center gap-2 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:top-0">
          {innerContent}
        </div>
        
      </div>
    </button>
  );
}
import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'medium', 
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props 
}) => {
  const buttonClasses = [
    'button',
    `button-${variant}`,
    `button-${size}`,
    fullWidth ? 'button-full-width' : '',
    icon ? 'button-with-icon' : '',
    iconPosition === 'right' ? 'icon-right' : 'icon-left',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      type={type}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="button-icon">{icon}</span>}
      <span className="button-text">{children}</span>
      {icon && iconPosition === 'right' && <span className="button-icon">{icon}</span>}
    </button>
  );
};

export default Button;

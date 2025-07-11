import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  title, 
  subtitle, 
  footer, 
  image, 
  elevation = 1, 
  className = '',
  onClick,
  ...props 
}) => {
  const cardClasses = [
    'card',
    `elevation-${elevation}`,
    onClick ? 'card-clickable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={onClick} {...props}>
      {image && (
        <div className="card-image">
          {typeof image === 'string' ? (
            <img src={image} alt={title || 'Card'} />
          ) : (
            image
          )}
        </div>
      )}
      
      <div className="card-content">
        {title && <h3 className="card-title">{title}</h3>}
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
        <div className="card-body">{children}</div>
      </div>
      
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;

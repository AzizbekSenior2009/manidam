import React from 'react';
import { Minus, Plus } from 'lucide-react';
import './QuantityStepper.css';

export default function QuantityStepper({ value, onDecrease, onIncrease, min = 1 }) {
  return (
    <div className="quantity-stepper">
      <button
        type="button"
        className="stepper-btn minus"
        onClick={onDecrease}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus size={13} strokeWidth={2.5} />
      </button>
      <span className="stepper-val">{value}</span>
      <button
        type="button"
        className="stepper-btn plus"
        onClick={onIncrease}
        aria-label="Increase quantity"
      >
        <Plus size={13} strokeWidth={2.5} />
      </button>
    </div>
  );
}

'use client';

type VegNonVegIconProps = {
  type: 'Veg' | 'Non-Veg' | 'Egg';
};

export const VegNonVegIcon = ({ type }: VegNonVegIconProps) => (
  <div className={`absolute top-2 left-2 w-5 h-5 flex items-center justify-center
    ${type === 'Veg' ? 'border-green-600' : type === 'Non-Veg' ? 'border-red-600' : 'border-yellow-600'}
    border-2 bg-white`}>
    <div className={`w-2.5 h-2.5 rounded-full
      ${type === 'Veg' ? 'bg-green-600' : type === 'Non-Veg' ? 'bg-red-600' : 'bg-yellow-600'}`} />
  </div>
);

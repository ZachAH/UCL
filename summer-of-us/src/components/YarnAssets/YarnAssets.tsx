export const YarnBall = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 200 200" 
    // Using a custom drop shadow for that "floating" effect
    className={`${className} drop-shadow-[0_25px_25px_rgba(0,0,0,0.2)]`} 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* The main body of the yarn ball */}
    <circle cx="100" cy="100" r="85" className="fill-current" />
    
    {/* Layered strands to create a realistic "wound" texture */}
    <g fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.4">
      <ellipse cx="100" cy="100" rx="80" ry="35" transform="rotate(30 100 100)" />
      <ellipse cx="100" cy="100" rx="80" ry="35" transform="rotate(-30 100 100)" />
      <ellipse cx="100" cy="100" rx="35" ry="80" transform="rotate(15 100 100)" />
      <ellipse cx="100" cy="100" rx="35" ry="80" transform="rotate(-15 100 100)" />
      <circle cx="100" cy="100" r="55" strokeDasharray="12 8" />
      <circle cx="100" cy="100" r="30" strokeDasharray="5 10" opacity="0.6" />
    </g>
    
    {/* Subtle highlight for 3D feel */}
    <circle cx="70" cy="70" r="20" fill="white" opacity="0.1" />
  </svg>
);

export const YarnTail = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 60 160" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* The main pulling string */}
    <path 
      d="M 30 0 Q 50 40, 15 75 T 30 150" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="7" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    
    {/* A small "fray" or knot at the end to make it a clear handle */}
    <circle cx="30" cy="150" r="10" className="fill-current" />
    <path 
      d="M 22 150 Q 30 165, 38 150" 
      fill="none" 
      stroke="white" 
      strokeWidth="2" 
      opacity="0.5"
    />
  </svg>
);
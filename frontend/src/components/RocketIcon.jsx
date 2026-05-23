const RocketIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    {/* Rocket body */}
    <path
      d="M32 6C32 6 24 16 24 34C24 38 26 42 28 44L32 40L36 44C38 42 40 38 40 34C40 16 32 6 32 6Z"
      fill="currentColor"
    />
    {/* Window */}
    <circle cx="32" cy="28" r="4" fill="white" />
    <circle cx="32" cy="28" r="2.5" fill="currentColor" opacity="0.3" />
    {/* Left fin */}
    <path
      d="M24 34C20 34 17 39 17 39L24 36Z"
      fill="currentColor"
      opacity="0.7"
    />
    {/* Right fin */}
    <path
      d="M40 34C44 34 47 39 47 39L40 36Z"
      fill="currentColor"
      opacity="0.7"
    />
    {/* Flame */}
    <path
      d="M28 44L30 52C30.5 54 31.5 56 32 58C32.5 56 33.5 54 34 52L36 44"
      fill="currentColor"
      opacity="0.35"
    />
    <path
      d="M30 44L31 50C31.3 51 31.7 52 32 53C32.3 52 32.7 51 33 50L34 44"
      fill="currentColor"
      opacity="0.55"
    />
  </svg>
);

export default RocketIcon;

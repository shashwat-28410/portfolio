import React from 'react';

export function BreezePlant() {
  return (
    <svg
      className="chome__plant"
      viewBox="0 0 338 372"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Pot Ceramic Gradient */}
        <linearGradient id="plant-pot-grad" x1="98" y1="235" x2="98" y2="365" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E2846A" />
          <stop offset="60%" stopColor="#D07055" />
          <stop offset="100%" stopColor="#B35B42" />
        </linearGradient>

        {/* Soil Gradient */}
        <radialGradient id="plant-soil-grad" cx="98" cy="250" r="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5A3E2B" />
          <stop offset="70%" stopColor="#3E271B" />
          <stop offset="100%" stopColor="#2A180F" />
        </radialGradient>

        {/* Left Leaf Lush Foliage Gradient */}
        <linearGradient id="plant-leaf-l-grad" x1="10" y1="110" x2="72" y2="155" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A4D882" />
          <stop offset="40%" stopColor="#6EBF6B" />
          <stop offset="100%" stopColor="#43944F" />
        </linearGradient>

        {/* Right Leaf Lush Foliage Gradient */}
        <linearGradient id="plant-leaf-r-grad" x1="225" y1="10" x2="330" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBD46D" />
          <stop offset="25%" stopColor="#9BD871" />
          <stop offset="70%" stopColor="#52A85B" />
          <stop offset="100%" stopColor="#317A3E" />
        </linearGradient>

        {/* Stem Gradients */}
        <linearGradient id="plant-stem-grad" x1="72" y1="135" x2="135" y2="263" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5EAA58" />
          <stop offset="100%" stopColor="#3A7036" />
        </linearGradient>
      </defs>

      {/* Pot Cast Shadow on Desk */}
      <path
        d="M133.032 362.266C160.202 357.29 181.125 347.302 179.765 339.958C178.405 332.614 155.278 330.695 128.108 335.671C100.938 340.648 80.0149 350.635 81.3746 357.979C82.7343 365.323 105.862 367.243 133.032 362.266Z"
        fill="rgba(33, 33, 33, 0.16)"
      />

      {/* Soil Top Ellipse */}
      <path
        d="M13.6001 250.217C13.6001 258.576 51.4198 265.359 98.0654 265.359C144.724 265.359 182.544 258.576 182.544 250.217C182.544 241.844 144.724 235.062 98.0654 235.062C51.4198 235.062 13.6001 241.844 13.6001 250.217Z"
        fill="url(#plant-soil-grad)"
        stroke="#212121"
        strokeWidth="1"
        strokeMiterlimit="10"
      />

      {/* Pot Rim Upper Body */}
      <path
        d="M13.6001 250.217V287.335L15.0179 290.106C22.2919 297.144 56.7077 302.483 98.0654 302.483C139.423 302.483 173.852 297.144 181.126 290.106L182.544 287.335V250.217C182.544 258.577 144.724 265.359 98.0654 265.359C51.4198 265.359 13.6001 258.577 13.6001 250.217Z"
        fill="url(#plant-pot-grad)"
        stroke="#212121"
        strokeWidth="1"
        strokeMiterlimit="10"
      />

      {/* Pot Lower Tapered Base */}
      <path
        d="M15.0186 290.111L49.3322 357.033C49.3322 361.861 71.1542 365.776 98.0725 365.776C124.997 365.776 146.819 361.861 146.819 357.033L181.133 290.111C173.859 297.149 139.437 302.488 98.0725 302.488C56.7148 302.488 22.2989 297.149 15.0249 290.111H15.0186Z"
        fill="#C9684F"
        stroke="#212121"
        strokeWidth="1"
        strokeMiterlimit="10"
      />

      {/* Decorative Ceramic Rim Line */}
      <path
        d="M26.9287 258.352C26.9287 258.352 111.911 275.851 173.769 256.922C173.769 256.922 94.9621 239.481 26.9287 258.352Z"
        fill="#F6B8A5"
        stroke="#212121"
        strokeWidth="0.8"
        strokeMiterlimit="10"
      />

      {/* Foliage with swaying animation classes */}
      <g className="chome__plant-foliage">
        {/* Left Branch */}
        <g className="chome__plant-stem chome__plant-stem--l">
          <path
            d="M72.7251 135.368C93.0182 143.967 139.085 178.149 135.208 263.511L135.202 263.644L135.069 263.653L133.899 263.743L133.724 263.757L133.738 263.582C136.772 225.861 126.018 163.134 72.1616 136.585L72.0298 136.52L72.0923 136.387L72.5308 135.442L72.5923 135.312L72.7251 135.368Z"
            fill="url(#plant-stem-grad)"
            stroke="#1B4219"
            strokeWidth="0.5"
          />
          <g className="chome__plant-leaf chome__plant-leaf--l">
            <path
              d="M0.53418 145.512C0.53418 145.512 10.6245 157.614 24.3423 153.182C38.0729 148.75 30.0006 138.245 36.8531 136.227C43.7184 134.209 41.298 149.555 36.0485 152.78C30.8053 156.005 45.3341 159.243 51.7907 146.719C58.2537 134.209 50.986 172.552 64.7038 149.152L72.7761 135.422C72.7761 135.422 78.6324 108.663 58.9498 112.163C58.9498 112.163 57.8449 135.02 51.7907 131.794C45.7301 128.557 52.193 115.241 46.1324 109.589C40.0846 103.944 15.8677 122.515 15.8677 122.515C15.8677 122.515 26.7628 125.74 25.1534 131.801C23.5441 137.849 19.5079 125.74 11.8379 126.143C4.16799 126.545 0.540566 145.512 0.540566 145.512H0.53418Z"
              fill="url(#plant-leaf-l-grad)"
              stroke="#212121"
              strokeWidth="0.8"
              strokeMiterlimit="10"
            />
          </g>
        </g>

        {/* Right Branch */}
        <g className="chome__plant-stem chome__plant-stem--r">
          <path
            d="M228.402 44.8291L229.789 44.8623L230.151 44.8711L229.889 45.1211C122.109 147.554 124.722 231.727 131.745 263.743L131.784 263.919L131.604 263.926L130.132 263.979L130.003 263.983L129.979 263.856C121.189 216.4 135.846 170.074 157.655 131.408C179.465 92.7422 208.436 61.721 228.302 44.8652L228.346 44.8281L228.402 44.8291Z"
            fill="url(#plant-stem-grad)"
            stroke="#1B4219"
            strokeWidth="0.5"
          />
          <g className="chome__plant-leaf chome__plant-leaf--r">
            <path
              d="M228.091 66.3323C228.091 66.3323 258.516 82.86 256.166 72.8271C253.815 62.7942 252.749 31.0607 259.352 49.8492C267.035 71.7606 274.066 69.2955 277.374 66.3386C280.67 63.3754 275.005 24.5339 284.904 34.4199C294.803 44.3186 271.244 74.9538 294.33 55.1562C317.417 35.3778 338.153 64.1098 336.742 44.7912C335.33 25.479 305.168 21.7047 296.208 15.1141C287.267 8.51061 317.883 8.03803 307.99 4.27649C298.104 0.495795 286.315 -0.915579 275.491 1.31324C264.653 3.54207 259.933 16.5254 250.973 19.3482C242.02 22.1709 258.516 1.44736 258.516 1.44736C258.516 1.44736 241.547 -1.38817 225.997 19.3482C210.452 40.0845 228.085 66.345 228.085 66.345L228.091 66.3323Z"
              fill="url(#plant-leaf-r-grad)"
              stroke="#212121"
              strokeWidth="0.8"
              strokeMiterlimit="10"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}

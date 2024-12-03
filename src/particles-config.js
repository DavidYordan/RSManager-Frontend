// particles-config.js
export default {
  particles: {
    number: {
      value: 80,
    },
    color: {
      value: ["#B9F2FF", "#C0C0C0", "#E5E4E2"],
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 0.5,
      random: true,
    },
    size: {
      value: 3,
      random: true,
    },
    move: {
      enable: true,
      speed: 1.5,
      direction: "none",
      random: false,
      straight: false,
      outModes: "out",
    },
    links: {
      enable: true,
      color: "#B9F2FF",
      distance: 150,
      opacity: 0.4,
      width: 1,
    },
  },
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "repulse",
      },
      onClick: {
        enable: true,
        mode: "push",
      },
    },
    modes: {
      repulse: {
        distance: 80,
        duration: 0.4,
      },
      push: {
        quantity: 4,
      },
    },
  },
  retina_detect: true,
};

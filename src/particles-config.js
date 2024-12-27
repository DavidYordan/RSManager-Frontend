import { plugins } from "chart.js";

// particles-config.js
export default {
  particles: {
    detectRetina: true,
    fpsLimit: 30,
    number: {
      value: 200,
      // density: {
      //   enable: true,
      //   value_area: 800
      // }
    },
    color: {
      value: ["#FBF7F3"],
      // value: ["#4BC0C0", "#FF6384", "#36A2EB", "#FFCE56"],
    },
    shape: {
      type: ["circle"],
      // type: ["circle", "triangle", "star", "polygon", "edge"],
    },
    opacity: {
      value: 0.5,
      random: true,
    },
    size: {
      value: 3,
      // value: {min: 5, max: 10},
      // random: true,
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
      color: "#ffd700",
      distance: 150,
      opacity: 0.5,
      width: 1,
    },
  },
  interactivity: {
    detectsOn: "window",
    events: {
      onHover: {
        enable: true,
        mode: "grab",
      },
      onClick: {
        enable: true,
        mode: "attract",
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 300,
        line_linked: {
          opacity: 0.1,
        },
      },
      attract: {
        distance: 600,
        duration: 1,
      },
    },
  },
  plugins: {
    emitters: {
      direction: "none",
      life: {
        count: 1,
        duration: 0.1,
        delay: 0.1,
      },
      size: {
        width: 10,
        height: 10,
      },
      rate: {
        delay: 0.1,
        quantity: 1,
      },
    },
  },
};

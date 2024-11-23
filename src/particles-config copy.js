export default {
    fullScreen: {
        enable: true,
        zIndex: -1
    },
    fpsLimit: 60,
    interactivity: {
        events: {
            onClick: {
                enable: true,
                mode: 'push'
            },
            onHover: {
                enable: true,
                mode: 'repulse'
            },
        },
        modes: {
            bubble: {
                distance: 400,
                duration: 2,
                opacity: 0.8,
                size: 40
            },
            push: {
                quantity: 4
            },
            repulse: {
                distance: 200,
                duration: 0.4
            }
        }
    },
    particles: {
        color: {
            value: ["#FF9A8B", "#FF6A88", "#FF99AC", "#FFC3A0"]
        },
        links: {
            color: ["#FF9A8B", "#FF6A88", "#FF99AC", "#FFC3A0"],
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1
        },
        move: {
            direction: 'none',
            enable: true,
            outModes: 'bounce',
            random: false,
            speed: 3,
            straight: false
        },
        number: {
            density: {
                enable: true,
            },
            value: 200
        },
        opacity: {
            value: 0.5
        },
        shape: {
            type: 'circle'
        },
        size: {
            value: { min: 5, max: 50 }
        }
    },
    detectRetina: true
};
  
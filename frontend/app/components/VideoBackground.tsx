import { Box } from "@mui/material";

const VideoBackground = () => {
    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                zIndex: -1
            }}
        >
            <video
                autoPlay
                loop
                muted
                playsInline
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                }}
            >
                <source src="/videos/bg.mp4" type="video/mp4" />
                مرورگر شما از ویدئو پشتیبانی نمی‌کند.
            </video>
        </Box>
    );
};

export default VideoBackground;

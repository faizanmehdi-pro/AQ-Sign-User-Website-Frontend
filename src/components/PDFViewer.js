import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import logo from "../assets/logo.jpeg";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const PDFViewer = ({ pDFFile }) => {
    // console.log("pdffile", pDFFile)
    const [showPopup, setShowPopup] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const canvasRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPopup(true);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    const pdfUrl = `http://98.81.159.86${pDFFile.pdfDocument}`;

    const saveSignatureMutation = useMutation({
        mutationFn: async (formData) => {
            const response = await fetch("http://98.81.159.86/Signature/", {
                method: "POST",
                body: formData,
            });
            if (!response.ok) throw new Error("Failed to save signature");
            return response.json();
        },
    });

    const getCanvasCoordinates = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        if (e.touches) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top,
            };
        }
        return { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
    };

    const startDrawing = (e) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const { x, y } = getCanvasCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
        canvas.isDrawing = true;
    };

    const draw = (e) => {
        e.preventDefault();
        if (!canvasRef.current.isDrawing) return;
        const ctx = canvasRef.current.getContext("2d");
        const { x, y } = getCanvasCoordinates(e);
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = (e) => {
        e.preventDefault();
        canvasRef.current.isDrawing = false;
    };

    const handleSubmit = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
            toast.error("Canvas not found!");
            return;
        }
    
        canvas.toBlob((blob) => {
            if (!blob) {
                toast.error("Failed to capture signature.");
                return;
            }
    
            const file = new File([blob], "signature.png", { type: "image/png" });
    
            const formData = new FormData();
        
            formData.append("customer_id", pDFFile.customer[0]?.id);
            formData.append("signature", file);
    
            saveSignatureMutation.mutate(formData, {
                onSuccess: (data) => {
                    toast.success(data.response.message || "Signature submitted successfully!");
                },
                onError: () => {
                    toast.error("Failed to save signature.");
                },
            });
        }, "image/png");
    };
    

    return (
        <>
            <Nav>
                <Logo>
                    <img src={logo} alt="logo" />
                </Logo>
                <Heading>AQ SIGN</Heading>
            </Nav>
            <PDFViewerWrapper>
                <PDFContainer>
                    <StyledIframe src={pdfUrl} title="PDF Viewer" />
                </PDFContainer>
            </PDFViewerWrapper>
            {showPopup && (
                <PopupContainer isMinimized={isMinimized}>
                    <PopupBox isMinimized={isMinimized}>
                        <PopupHeader>
                            <h3>{isMinimized ? "📌" : "Add Signature!"}</h3>
                            <MinimizeButton onClick={() => setIsMinimized(!isMinimized)}>
                                {isMinimized ? "🔼" : "🔽"}
                            </MinimizeButton>
                        </PopupHeader>

                        {!isMinimized && (
                            <PopupContent>
                                <SignatureContainer>
                                    <CanvasWrapper>
                                        <canvas
                                            ref={canvasRef}
                                            width={400}
                                            height={300}
                                            onMouseDown={startDrawing}
                                            onMouseMove={draw}
                                            onMouseUp={stopDrawing}
                                            onMouseLeave={stopDrawing}
                                            onTouchStart={startDrawing}
                                            onTouchMove={draw}
                                            onTouchEnd={stopDrawing}
                                        />
                                    </CanvasWrapper>
                                    <FileButton onClick={handleSubmit} disabled={saveSignatureMutation.isLoading}>
                                        {saveSignatureMutation.isLoading ? "Submitting..." : "Submit"}
                                    </FileButton>
                                </SignatureContainer>
                            </PopupContent>
                        )}
                    </PopupBox>
                </PopupContainer>
            )}
        </>
    );
};

export default PDFViewer;

/* Styled Components */
const PDFViewerWrapper = styled.div`
    display: flex;
    justify-content: center;
    padding: 0 30px 30px;
    width: 100%;
`;

const PDFContainer = styled.div`
    display: flex;
    width: 100%;
`;

const StyledIframe = styled.iframe`
    width: 100%;
    height: 100vh;
    border: none;
    background-color: #fff;
`;

const Nav = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 30px;
`;

const Heading = styled.h1`
    font-size: 32px;
    color: #165277;
`;

const Logo = styled.div`
    img {
        width: 130px;
        height: 80px;
    }
`;

const PopupContainer = styled.div`
    position: fixed;
    ${({ isMinimized }) => (isMinimized ? "bottom: 20px; right: 20px;" : "top: 50%; left: 50%; transform: translate(-50%, -50%);")}
    width: ${({ isMinimized }) => (isMinimized ? "100px" : "100%")};
    height: ${({ isMinimized }) => (isMinimized ? "50px" : "100%")};
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    
//   @media screen and (max-width: 768px){
//     ${({ isMinimized }) => (isMinimized ? "bottom: 20px; right: 20px;" : "top: 0; left: 0; bottom: 0; right: 0; transform: none;")}
//     width: ${({ isMinimized }) => (isMinimized ? "100px" : "100%")};
//     height: ${({ isMinimized }) => (isMinimized ? "50px" : "100vh")};
//   }
`;

const PopupBox = styled.div`
    background: white;
    padding: 15px;
    border-radius: 8px;
    max-width: 400px;
    width: 100%;
`;

const PopupHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const PopupContent = styled.div`
    margin-top: 10px;
`;

const SignatureContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    justify-content: center;
    padding: 20px;
`;

const CanvasWrapper = styled.div`
    canvas {
        width: 100%;
        height: auto;
        border: 1px solid #165277;
    }
`;

const FileButton = styled.button`
    padding: 10px;
    background-color: #165277;
    color: #fff;
    border: none;
    cursor: pointer;
    &:hover {
        background-color: #113b58;
    }
`;

const MinimizeButton = styled.button`
    background: #f0ad4e;
    border: none;
    padding: 5px;
    cursor: pointer;
`;


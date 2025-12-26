import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";

interface FloatingFormButtonsProps {
    onCancel?: () => void;
    onSubmit?: () => void;
    submitLabel?: string;
    cancelLabel?: string;
    processing?: boolean;
    isSubmitButton?: boolean;
}

const FloatingFormButtons: React.FC<FloatingFormButtonsProps> = ({
    onCancel,
    submitLabel = "Simpan",
    cancelLabel = "Batal",
    processing = false,
    isSubmitButton = true,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFloating, setIsFloating] = useState(true);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // When the original position is visible, don't float
                setIsFloating(!entry.isIntersecting);
            },
            {
                root: null,
                rootMargin: "0px",
                threshold: 0.1,
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    const buttonContent = (
        <>
            {onCancel && (
                <Button
                    type="button"
                    variant="destructive"
                    size="default"
                    className="w-full sm:w-auto"
                    onClick={onCancel}
                >
                    {cancelLabel}
                </Button>
            )}
            <Button
                type={isSubmitButton ? "submit" : "button"}
                size="default"
                className="w-full sm:w-auto"
                disabled={processing}
            >
                {processing ? "Menyimpan..." : submitLabel}
            </Button>
        </>
    );

    return (
        <>
            {/* Floating buttons - shown when original position is not visible */}
            {isFloating && (
                <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 backdrop-blur-sm p-3 shadow-lg">
                    <div className="container mx-auto flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-2">
                        {buttonContent}
                    </div>
                </div>
            )}

            {/* Original position buttons - always rendered but visibility controlled */}
            <div
                ref={containerRef}
                className={`flex flex-col-reverse gap-2 pt-3 sm:flex-row sm:justify-end sm:gap-1.5 ${isFloating ? "invisible" : "visible"
                    }`}
            >
                {buttonContent}
            </div>

            {/* Spacer when floating to prevent content jump */}
            {isFloating && <div className="h-16" />}
        </>
    );
};

export default FloatingFormButtons;

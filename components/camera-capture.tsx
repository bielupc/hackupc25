"use client"

import { useRef, useState, useCallback } from "react"
import { Camera, ImageIcon, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CameraCaptureProps {
  onCapture: (image: string) => void
  capturedImage: string | null
}

export default function CameraCapture({ onCapture, capturedImage }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isStreaming, setIsStreaming] = useState(false)

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setIsStreaming(true)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsStreaming(false)
    }
  }, [])

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageData = canvas.toDataURL("image/png")
        onCapture(imageData)
        stopCamera()
      }
    }
  }, [onCapture, stopCamera])

  const retakePhoto = useCallback(() => {
    onCapture("")
    startCamera()
  }, [onCapture, startCamera])

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
        {!isStreaming && !capturedImage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <ImageIcon className="h-12 w-12 mb-2" />
            <p className="text-sm">Capture your luggage photo</p>
          </div>
        )}

        {!capturedImage ? (
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline />
        ) : (
          <img
            src={capturedImage || "/placeholder.svg"}
            alt="Captured luggage"
            className="w-full h-full object-cover"
          />
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex justify-center gap-4">
        {!isStreaming && !capturedImage ? (
          <Button onClick={startCamera} className="rounded-full">
            <Camera className="mr-2 h-4 w-4" />
            Open Camera
          </Button>
        ) : !capturedImage ? (
          <Button onClick={capturePhoto} className="rounded-full">
            <Camera className="mr-2 h-4 w-4" />
            Take Photo
          </Button>
        ) : (
          <Button onClick={retakePhoto} variant="outline" className="rounded-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retake Photo
          </Button>
        )}
      </div>
    </div>
  )
}

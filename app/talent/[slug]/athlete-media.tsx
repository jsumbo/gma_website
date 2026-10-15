"use client"

import { useState } from "react"
import Image from "next/image"
import { Play, X, Film } from "lucide-react"
import type { HighlightVideo } from "@/lib/data"

interface AthleteMediaProps {
  gallery: string[]
  highlightVideo?: string
  highlightVideos?: HighlightVideo[]
  athleteName: string
}

function isVideoUrl(url: string) {
  return /\.(mp4|webm|mov|avi|m4v)(\?|$)/i.test(url)
}

function isYouTubeUrl(url: string) {
  return url.includes("youtube.com") || url.includes("youtu.be")
}

function toEmbedUrl(url: string) {
  if (url.includes("youtube.com/embed/")) return url
  const v =
    url.match(/[?&]v=([^&]+)/)?.[1] ??
    url.match(/youtu\.be\/([^?]+)/)?.[1]
  return v ? `https://www.youtube.com/embed/${v}` : url
}

function getYouTubeThumbnail(url: string): string | null {
  const id =
    url.match(/youtube\.com\/embed\/([^?]+)/)?.[1] ??
    url.match(/[?&]v=([^&]+)/)?.[1] ??
    url.match(/youtu\.be\/([^?]+)/)?.[1]
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}

export function AthleteMedia({ gallery, highlightVideo, highlightVideos, athleteName }: AthleteMediaProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  const videos: HighlightVideo[] =
    highlightVideos && highlightVideos.length > 0
      ? highlightVideos
      : highlightVideo
      ? [{ url: highlightVideo }]
      : []

  return (
    <>
      {videos.length > 0 && (
        <section className="py-16 lg:py-24 px-7 sm:px-12 lg:px-16 xl:px-24">
          <div className="mx-auto max-w-7xl">
            <div className="w-8 h-[3px] mb-6" style={{ backgroundColor: "#fee11b" }} />
            <h2 className="font-display text-4xl sm:text-5xl mb-10" style={{ color: "#01255f" }}>
              HIGHLIGHTS
            </h2>

            {videos.length === 1 ? (
              <div
                className="relative aspect-video bg-neutral-900 cursor-pointer group overflow-hidden"
                onClick={() => setActiveVideo(videos[0].url)}
              >
                {getYouTubeThumbnail(videos[0].url) ? (
                  <Image
                    src={getYouTubeThumbnail(videos[0].url)!}
                    alt={videos[0].label ?? `${athleteName} highlights`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 80vw"
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-neutral-900" />
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <div
                    className="w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: "#fee11b" }}
                  >
                    <Play className="h-8 w-8 ml-1" style={{ color: "#01255f" }} fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6">
                  <p className="font-heading font-semibold text-sm uppercase tracking-wider text-white">
                    {videos[0].label ?? `Watch ${athleteName}'s Highlights`}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((video, i) => {
                  const thumb = getYouTubeThumbnail(video.url)
                  return (
                    <div
                      key={i}
                      className="relative aspect-video bg-neutral-900 cursor-pointer group overflow-hidden"
                      onClick={() => setActiveVideo(video.url)}
                    >
                      {thumb ? (
                        <Image
                          src={thumb}
                          alt={video.label ?? `${athleteName} video ${i + 1}`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Film className="h-10 w-10 text-white/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <div
                          className="w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: "#fee11b" }}
                        >
                          <Play className="h-5 w-5 ml-0.5" style={{ color: "#01255f" }} fill="currentColor" />
                        </div>
                      </div>
                      {video.label && (
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="font-heading font-semibold text-xs uppercase tracking-wider text-white truncate">
                            {video.label}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="py-16 lg:py-24 px-7 sm:px-12 lg:px-16 xl:px-24">
          <div className="mx-auto max-w-7xl">
            <div className="w-8 h-[3px] mb-6" style={{ backgroundColor: "#fee11b" }} />
            <h2 className="font-display text-4xl sm:text-5xl mb-10" style={{ color: "#01255f" }}>
              GALLERY
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gallery.map((url, index) => {
                const isVid = isVideoUrl(url)
                return (
                  <div
                    key={index}
                    className="relative aspect-[4/3] bg-neutral-900 cursor-pointer group overflow-hidden"
                    onClick={() => isVid ? setActiveVideo(url) : setSelectedImage(url)}
                  >
                    {isVid ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Film className="h-10 w-10 text-white/20" />
                      </div>
                    ) : (
                      <Image
                        src={url}
                        alt={`${athleteName} photo ${index + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                      />
                    )}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                      style={{ backgroundColor: "rgba(1,37,95,0.3)" }}
                    >
                      {isVid ? (
                        <div
                          className="w-14 h-14 flex items-center justify-center"
                          style={{ backgroundColor: "#fee11b" }}
                        >
                          <Play className="h-5 w-5 ml-0.5" style={{ color: "#01255f" }} fill="currentColor" />
                        </div>
                      ) : (
                        <span className="font-heading font-bold text-xs uppercase tracking-widest text-white/90">View</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-white/70 transition-colors"
            onClick={() => setSelectedImage(null)}
            aria-label="Close"
          >
            <X className="h-8 w-8" />
          </button>
          <div className="relative w-full max-w-5xl aspect-[4/3]">
            <Image src={selectedImage} alt="Gallery image" fill className="object-contain" />
          </div>
        </div>
      )}

      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-white/70 transition-colors"
            onClick={() => setActiveVideo(null)}
            aria-label="Close"
          >
            <X className="h-8 w-8" />
          </button>
          <div
            className="relative w-full max-w-5xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            {isYouTubeUrl(activeVideo) ? (
              <iframe
                src={toEmbedUrl(activeVideo)}
                title={`${athleteName} video`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={activeVideo}
                controls
                autoPlay
                className="w-full h-full"
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}

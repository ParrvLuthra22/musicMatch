import React from 'react';
import { Skeleton } from './ui/Skeleton';

export const MatchCardSkeleton = () => (
    <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-bg-card border border-white/10">
        <Skeleton className="absolute inset-0 w-full h-full" />
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3 z-10">
            <Skeleton className="h-8 w-3/4 rounded-lg" />
            <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
            </div>
        </div>
    </div>
);

export const ProfileSkeleton = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        {/* Header */}
        <div className="relative h-64 md:h-80 rounded-b-3xl overflow-visible">
            <Skeleton className="w-full h-full rounded-b-3xl" />
            <div className="absolute -bottom-16 left-8 flex items-end gap-6">
                <Skeleton className="w-32 h-32 rounded-full border-4 border-black" />
                <div className="mb-4 space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20 px-4">
            {/* DNA Section */}
            <div className="md:col-span-2 space-y-6">
                <Skeleton className="h-64 w-full rounded-3xl" />
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-32 w-full rounded-2xl" />
                    <Skeleton className="h-32 w-full rounded-2xl" />
                </div>
            </div>
            <div>
                <Skeleton className="h-96 w-full rounded-3xl" />
            </div>
        </div>
    </div>
);

export const EventCardSkeleton = () => (
    <div className="bg-bg-card rounded-2xl overflow-hidden border border-white/10 h-full flex flex-col">
        <div className="relative aspect-[4/3]">
            <Skeleton className="absolute inset-0 w-full h-full" />
        </div>
        <div className="p-4 space-y-3 flex-1">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between items-center mt-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>
        </div>
    </div>
);

export const MessageSkeleton = ({ isOwn }) => (
    <div className={`flex w-full mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
        {!isOwn && <Skeleton className="w-8 h-8 rounded-full mr-2" />}
        <div className={`max-w-[70%] p-4 rounded-2xl ${isOwn ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-4 w-20" />
        </div>
    </div>
);

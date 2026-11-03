import React from 'react';

export const EventCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl bg-[#170a1a] border border-[#2d1334] overflow-hidden animate-pulse flex flex-col">
      <div className="w-full aspect-[4/3] bg-[#26102c]" />
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-3 w-1/3 bg-[#2f1437] rounded" />
          <div className="h-5 w-4/5 bg-[#36173f] rounded" />
          <div className="h-3 w-2/3 bg-[#26102c] rounded" />
        </div>
        <div className="pt-3 border-t border-[#260f2d] flex items-center justify-between">
          <div className="h-4 w-1/4 bg-[#32133b] rounded" />
          <div className="h-8 w-20 bg-[#42174d] rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export const TicketRowSkeleton: React.FC = () => {
  return (
    <div className="p-4 rounded-2xl bg-[#170a1a] border border-[#2d1334] animate-pulse flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-[#291130] shrink-0" />
        <div className="space-y-2">
          <div className="h-4 w-40 bg-[#35163e] rounded" />
          <div className="h-3 w-28 bg-[#291130] rounded" />
        </div>
      </div>
      <div className="h-8 w-24 bg-[#3d1848] rounded-xl" />
    </div>
  );
};

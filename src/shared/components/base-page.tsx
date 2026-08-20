"use client";

import { cn } from "@/src/core/utils/utils";
import React from "react";

interface BasePageProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export function BasePage({
  children,
  className,
  containerClassName,
}: BasePageProps) {
  return (
    <main
      className={cn(
        "flex min-h-0 w-full flex-1 flex-col overflow-hidden",
        containerClassName,
      )}
    >
      <div
        className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden  md:p-6 lg:p-8",
          className,
        )}
      >
        <div className=" w-full max-w-10xl">{children}</div>
      </div>
    </main>
  );
}

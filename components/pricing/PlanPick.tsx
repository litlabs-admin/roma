"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { PlanId } from "@/lib/content/pricing";

/**
 * The plan the visitor's portal count points to, shared by the plan cards (featured red
 * card) and the feature matrix (highlighted column). Growth until they pick.
 */
type Ctx = { pick: PlanId; setPick: (p: PlanId) => void };

const PlanPickContext = createContext<Ctx>({ pick: "growth", setPick: () => {} });

export function PlanPickProvider({ children }: { children: ReactNode }) {
  const [pick, setPick] = useState<PlanId>("growth");
  return <PlanPickContext.Provider value={{ pick, setPick }}>{children}</PlanPickContext.Provider>;
}

export const usePlanPick = () => useContext(PlanPickContext);

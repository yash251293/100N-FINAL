"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SearchIcon, XIcon, MapPinIcon, BuildingIcon, LinkIcon, BriefcaseIcon, UserIcon, GraduationCapIcon } from "lucide-react";
import { OnboardingStepper } from "@/components/onboarding-stepper";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { updateUserProfile } from "@/lib/api";

export default function ProfilePage() {
  return <div>Test Page. If you see this, the basic component compiles.</div>;
}

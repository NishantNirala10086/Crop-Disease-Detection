"use client"

import { ScanLine, Bug, ShieldCheck, TrendingUp, Plane, IndianRupee } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function Dashboard() {
  const stats = [
    {
      label: "Total Scans",
      value: "0",
      icon: ScanLine,
      color: "bg-[#1B5E20]/10 text-[#1B5E20]",
    },
    {
      label: "Diseases Found",
      value: "0",
      icon: Bug,
      color: "bg-red-50 text-red-600",
    },
    {
      label: "Drone Flights",
      value: "0",
      icon: Plane,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Accuracy Rate",
      value: "95%",
      icon: TrendingUp,
      color: "bg-amber-50 text-amber-600",
    },
  ]

  const recentDiseases = [
    { name: "Pepper Bell Bacterial Spot", crop: "Pepper", severity: "High" },
    { name: "Tomato Late Blight", crop: "Tomato", severity: "Critical" },
    { name: "Potato Early Blight", crop: "Potato", severity: "Medium" },
    { name: "Apple Scab", crop: "Apple", severity: "Low" },
  ]

  return (
    <div className="flex-1 flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="mb-2">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1B5E20] via-green-600 to-[#81C784]">
          Crop Disease Detection
        </h1>
        <p className="text-muted-foreground mt-2 font-medium">Monitor and manage the health of your crops in real-time.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group relative bg-white/60 backdrop-blur-xl rounded-2xl border border-green-100/50 p-6 flex items-center gap-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${stat.color}`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div className="relative z-10">
              <p className="text-3xl font-black text-foreground">{stat.value}</p>
              <p className="text-sm font-semibold text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Diseases + Tips */}
      <div className="grid grid-cols-2 gap-6 flex-1">
        {/* Common Diseases */}
        <div className="bg-gradient-to-br from-white to-green-50/30 rounded-3xl border border-green-100/50 p-7 shadow-lg hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
            <Bug className="w-5 h-5 text-[#1B5E20]" />
            Common Diseases
          </h2>
          <div className="flex flex-col gap-3">
            {recentDiseases.map((d) => (
              <Dialog key={d.name}>
                <DialogTrigger asChild>
                  <div className="cursor-pointer flex items-center justify-between rounded-2xl bg-white border border-green-50 shadow-sm px-5 py-4 hover:bg-green-50/50 hover:shadow-md transition-all hover:-translate-y-0.5">
                    <div>
                      <p className="text-base font-bold text-foreground">{d.name}</p>
                      <p className="text-sm font-medium text-muted-foreground">Crop: {d.crop}</p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        d.severity === "Critical"
                          ? "bg-red-100 text-red-700"
                          : d.severity === "High"
                          ? "bg-orange-100 text-orange-700"
                          : d.severity === "Medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {d.severity}
                    </span>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-2xl text-[#1B5E20]">{d.name}</DialogTitle>
                  </DialogHeader>
                  <div className="py-2">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="font-semibold">Crop affected:</span>
                      <span className="bg-gray-100 px-2 py-1 rounded-md text-sm">{d.crop}</span>
                    </div>
                    <div className="mb-4 flex items-center gap-2">
                      <span className="font-semibold">Severity level:</span>
                      <span className={`px-2 py-1 rounded-md text-sm font-bold ${
                        d.severity === "Critical" ? "bg-red-100 text-red-700" :
                        d.severity === "High" ? "bg-orange-100 text-orange-700" :
                        d.severity === "Medium" ? "bg-amber-100 text-amber-700" :
                        "bg-green-100 text-green-700"
                      }`}>{d.severity}</span>
                    </div>
                    <div className="bg-green-50/50 border border-green-100 p-4 rounded-xl mt-4">
                      <h4 className="font-bold text-green-900 mb-2">General Treatment Plan</h4>
                      <p className="text-sm text-green-800 leading-relaxed">
                        To treat <strong>{d.name}</strong>, isolate affected areas if possible. Ensure proper drainage and avoid overhead watering to strictly limit fungal spread. Applying a recommended organic fungicide or chemical agent standard for {d.crop} crops provides the best results.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-br from-white to-amber-50/30 rounded-3xl border border-amber-100/50 p-7 shadow-lg hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
            <ScanLine className="w-5 h-5 text-amber-600" />
            Quick Tips
          </h2>
          <div className="flex flex-col gap-4">
            {[
              { title: "Upload Clear Images", desc: "Take photos in natural light with the affected area in focus" },
              { title: "Use Drone Monitor", desc: "Upload aerial images to find exactly which zones need medicine" },
              { title: "Save Money", desc: "Only treat diseased zones instead of spraying the entire field" },
              { title: "Follow Treatment", desc: "Apply recommended treatments consistently for best results" },
            ].map((tip) => (
              <div key={tip.title} className="group flex items-start gap-4 rounded-2xl bg-white border border-amber-50 shadow-sm px-5 py-4 hover:bg-amber-50/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-amber-100/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                   <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                </div>
                <div>
                  <p className="text-base font-bold text-foreground mb-0.5">{tip.title}</p>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

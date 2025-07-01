"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Eye, EyeOff, Mail, Lock, User, Stethoscope, Phone, Calendar } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiRequest } from "@/lib/api"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [patient, setPatient] = useState({ firstName: "", lastName: "", email: "", phone: "", dob: "", password: "" })
  const [doctor, setDoctor] = useState({ firstName: "", lastName: "", email: "", license: "", specialty: "", hospital: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handlePatientRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      const res = await apiRequest("register", "POST", { ...patient, role: "patient" })
      // Optionally auto-login after registration
      const loginRes = await apiRequest("login", "POST", { email: patient.email, password: patient.password, role: "patient" })
      localStorage.setItem("token", loginRes.token)
      router.push("/patient/dashboard")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDoctorRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      const res = await apiRequest("register", "POST", { ...doctor, role: "doctor" })
      // Optionally auto-login after registration
      const loginRes = await apiRequest("login", "POST", { email: doctor.email, password: doctor.password, role: "doctor" })
      localStorage.setItem("token", loginRes.token)
      router.push("/doctor/dashboard")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <Heart className="h-8 w-8 text-sky-500" />
            <span className="text-2xl font-bold text-gray-900">MediCare</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join our healthcare platform today</p>
        </div>

        {/* Registration Form */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <Tabs defaultValue="patient" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="patient" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Patient</span>
                </TabsTrigger>
                <TabsTrigger value="doctor" className="flex items-center space-x-2">
                  <Stethoscope className="h-4 w-4" />
                  <span>Doctor</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="patient">
                <form onSubmit={handlePatientRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" placeholder="John" required value={patient.firstName} onChange={e => setPatient(p => ({ ...p, firstName: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" placeholder="Doe" required value={patient.lastName} onChange={e => setPatient(p => ({ ...p, lastName: e.target.value }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="patient-email"
                        type="email"
                        placeholder="john@example.com"
                        className="pl-10"
                        required
                        value={patient.email}
                        onChange={e => setPatient(p => ({ ...p, email: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" className="pl-10" required value={patient.phone} onChange={e => setPatient(p => ({ ...p, phone: e.target.value }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input id="dob" type="date" className="pl-10" required value={patient.dob} onChange={e => setPatient(p => ({ ...p, dob: e.target.value }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="patient-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="pl-10 pr-10"
                        required
                        value={patient.password}
                        onChange={e => setPatient(p => ({ ...p, password: e.target.value }))}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="terms" className="rounded" required />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the{" "}
                      <Link href="/terms" className="text-sky-600 hover:text-sky-700">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-sky-600 hover:text-sky-700">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Patient Account"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="doctor">
                <form onSubmit={handleDoctorRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctor-first-name">First Name</Label>
                      <Input id="doctor-first-name" placeholder="Dr. Jane" required value={doctor.firstName} onChange={e => setDoctor(d => ({ ...d, firstName: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctor-last-name">Last Name</Label>
                      <Input id="doctor-last-name" placeholder="Smith" required value={doctor.lastName} onChange={e => setDoctor(d => ({ ...d, lastName: e.target.value }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="doctor-email"
                        type="email"
                        placeholder="doctor@hospital.com"
                        className="pl-10"
                        required
                        value={doctor.email}
                        onChange={e => setDoctor(d => ({ ...d, email: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="license">Medical License Number</Label>
                    <Input id="license" placeholder="MD123456789" required value={doctor.license} onChange={e => setDoctor(d => ({ ...d, license: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty</Label>
                    <Select required value={doctor.specialty} onValueChange={val => setDoctor(d => ({ ...d, specialty: val }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Medicine</SelectItem>
                        <SelectItem value="cardiology">Cardiology</SelectItem>
                        <SelectItem value="endocrinology">Endocrinology</SelectItem>
                        <SelectItem value="neurology">Neurology</SelectItem>
                        <SelectItem value="orthopedics">Orthopedics</SelectItem>
                        <SelectItem value="pediatrics">Pediatrics</SelectItem>
                        <SelectItem value="psychiatry">Psychiatry</SelectItem>
                        <SelectItem value="radiology">Radiology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hospital">Hospital/Clinic</Label>
                    <Input id="hospital" placeholder="General Hospital" required value={doctor.hospital} onChange={e => setDoctor(d => ({ ...d, hospital: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="doctor-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="pl-10 pr-10"
                        required
                        value={doctor.password}
                        onChange={e => setDoctor(d => ({ ...d, password: e.target.value }))}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="doctor-terms" className="rounded" required />
                    <label htmlFor="doctor-terms" className="text-sm text-gray-600">
                      I agree to the{" "}
                      <Link href="/terms" className="text-sky-600 hover:text-sky-700">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-sky-600 hover:text-sky-700">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Doctor Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-sky-600 hover:text-sky-700 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

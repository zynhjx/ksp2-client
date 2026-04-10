'use client'

import CardTitle from '@/components/auth/CardTitle'
import { motion } from 'framer-motion'
import FormInput from '@/components/auth/form/FormInput'
import { useState } from 'react'
import Button from '@/components/Button'
import { twMerge } from 'tailwind-merge'
import { toast } from 'react-toastify'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from '@/components/ui/select'
import { EXPRESS_API_URL } from '@/lib/env'


const months = [
  { name: "January", value: 1 },
  { name: "February", value: 2 },
  { name: "March", value: 3 },
  { name: "April", value: 4 },
  { name: "May", value: 5 },
  { name: "June", value: 6 },
  { name: "July", value: 7 },
  { name: "August", value: 8 },
  { name: "September", value: 9 },
  { name: "October", value: 10 },
  { name: "November", value: 11 },
  { name: "December", value: 12 },
];

const genders = [
  "Male",
  "Female",
  "Others"
]

const barangays = [
  "Barangay Simpocan",
  "Barangay Bagong Bayan",
  "Barangay Napsan"
]

const educationLevels = [
  "No Formal Education",
  "Elementary Graduate",
  "High School Level",
  "High School Graduate",
  "Vocational/Trade Course",
  "Some College",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate/PhD"
];

const employmentStatuses = [
  "Employed",
  "Unemployed",
  "Self-Employed",
  "Freelancer",
  "Student",
  "Retired",
  "Homemaker",
  "Part-Time",
  "Intern/Trainee"
]

const OnboardingPage = () => {
  const [step, setStep] = useState(1)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [gender, setGender] = useState("")
  const [barangay, setBarangay] = useState("");
  const [contact, setContact] = useState("");
  const [education, setEducation] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = {
      firstName,
      lastName,
      dateOfBirth: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      gender,
      barangay,
      contact,
      education,
      employmentStatus
    };

    try {
      const res = await fetch(`${EXPRESS_API_URL}/api/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData }),
        credentials: "include", // include cookies if you're using auth
      });

      const data = await res.json();

      if (!res.ok) {  
        throw new Error(data.message || "Something went wrong");
      }

      console.log("Success:", data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };


  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!isFormValid()) {
      return toast.error("inputs are not valid")
    }

    setStep(prev => prev + 1)
  }

  const handlePrev = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setStep(prev => prev - 1)
  }

  const isFormValid = () => {
    switch (step) {
      case 1:
        return firstName.trim() !== "" && lastName.trim() !== "" && month.trim() !== "" && day.trim() !== "" && day.length === 2 && year.trim() !== "" && year.length === 4

      case 2:
        return contact.trim() !== "" && contact.length >= 11 && barangay.trim() !== "" && education.trim() !== "" && employmentStatus.trim() !== ""
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-theme-white md:bg-gray-50 flex flex-col items-center md:justify-center md:p-6 text-gray-900">
      <div className="w-full mt-8 md:mt-0 max-w-full md:max-w-xl bg-theme-white md:rounded-3xl md:shadow-xl md:shadow-theme-blue/40 md:border border-gray-100 overflow-hidden p-8 md:p-12">
        <CardTitle title='Welcome Aboard' subtitle='Let’s get you set up in just a few steps.'/>
        <form onSubmit={handleSubmit}>
          {step === 1 ? (
            <motion.div
              initial={{x: 10, opacity: 0}}
              animate={{x: 0, opacity: 1}}
              exit={{x:-10, opacity: 0}}
              transition={{ duration: 0.5 }}
              className='space-y-4'
            >
              <div className='flex flex-col md:flex-row gap-x-2 space-y-4 md:space-y-0'>
                <FormInput
                  value={firstName}
                  label='First Name' 
                  type='text'
                  placeholder='Juan'
                  onChange={(e) => setFirstName(e.target.value)}/>

                <FormInput
                  value={lastName}
                  label='Last Name' 
                  type='text' 
                  placeholder='Dela Cruz'
                  onChange={(e) => setLastName(e.target.value)}/>

              </div>

              <div className='flex flex-col'>
                <label className="text-sm font-semibold text-gray-700">Date of Birth</label>
                <div className='flex gap-x-2 '>
                  <Select value={month} onValueChange={setMonth}>
                    <SelectTrigger className='text-base min-h-12 flex-1 px-4 rounded border border-gray-200 focus:border-theme-blue focus:ring-0 outline-none transition'>
                      <SelectValue placeholder="Month"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {months.map((m) => (
                          <SelectItem key={m.value} value={m.value.toString()}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  
                  <FormInput
                    value={day}
                    type='text'
                    inputMode='numeric'
                    containerClassName='flex-1'
                    maxLength={2}
                    placeholder='Day'
                    onChange={(e) => setDay(e.target.value.replace(/\D/g, ""))}/>

                  <FormInput
                    value={year}
                    containerClassName='flex-1'
                    type='text'
                    inputMode='numeric'
                    maxLength={4}
                    placeholder='Year'
                    onChange={(e) => setYear(e.target.value.replace(/\D/g, ""))}/>
                </div>
              </div>

              <label className="text-sm font-semibold text-gray-700">Gender</label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className='text-base w-full min-h-12 flex-1 px-4 rounded border border-gray-200 focus:border-theme-blue focus:ring-0 outline-none transition'>
                  <SelectValue placeholder="Select Gender"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {genders.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              

            </motion.div>
          ): step === 2 ? (
            <motion.div
            className='space-y-4'
              initial={{x: 10, opacity: 0}}
              animate={{x: 0, opacity: 1}}
              exit={{x:-10, opacity: 0}}
              transition={{ duration: 0.5 }}
            >

              <FormInput
                  value={contact}
                  label='Contact Number' 
                  type='text'
                  inputMode='numeric'
                  placeholder='e.g., 09123456789'
                  onChange={(e) => setContact(e.target.value.replace(/\D/g, ""))}/>

              <label className="text-sm font-semibold text-gray-700">Barangay</label>
              <Select value={barangay} onValueChange={setBarangay}>
                <SelectTrigger className='text-base w-full min-h-12 flex-1 px-4 rounded border border-gray-200 focus:border-theme-blue focus:ring-0 outline-none transition'>
                  <SelectValue placeholder="Select Barangay"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {barangays.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <label className="text-sm font-semibold text-gray-700">Education</label>
              <Select value={education} onValueChange={setEducation}>
                <SelectTrigger className='text-base w-full min-h-12 flex-1 px-4 rounded border border-gray-200 focus:border-theme-blue focus:ring-0 outline-none transition'>
                  <SelectValue placeholder="Select Education Level"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {educationLevels.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <label className="text-sm font-semibold text-gray-700">Employment Status</label>
              <Select value={employmentStatus} onValueChange={setEmploymentStatus}>
                <SelectTrigger className='text-base w-full min-h-12 flex-1 px-4 rounded border border-gray-200 focus:border-theme-blue focus:ring-0 outline-none transition'>
                  <SelectValue placeholder="Select Employment Status"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {employmentStatuses.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

            </motion.div>
          ): null}
          

          <div className='mt-6 flex gap-x-4'>

            {step !== 1 && (
              <Button 
                className='flex-1'
                type='button' 
                onClick={handlePrev}>Prev</Button>
            )}

            <Button 
              className='flex-2'
              primary type={step !== 2 ? 'button' : 'submit'} disabled={!isFormValid()} onClick={step !== 2 ? handleNext : undefined}>
                {step !== 2 ? "Next" : "Submit"}
              </Button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default OnboardingPage
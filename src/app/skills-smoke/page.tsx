"use client"

import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { CheckCircle, Rocket, Sparkles } from "lucide-react"
import { app } from "@/lib/firebase/client"

export default function SkillsSmokePage() {
    // Verify Firebase is initialized
    const firebaseInitialized = !!app

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto space-y-6"
            >
                <div className="text-center space-y-2">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-4xl font-bold tracking-tight"
                    >
                        Skills Smoke Test
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-muted-foreground"
                    >
                        Verifying all skill pack installations
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {/* shadcn/ui + Radix + Tailwind Test */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    shadcn/ui + Radix + Tailwind
                                </CardTitle>
                                <CardDescription>UI components working</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Button variant="default" className="w-full">
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Default Button
                                    </Button>
                                    <Button variant="secondary" className="w-full">
                                        Secondary Button
                                    </Button>
                                    <Button variant="outline" className="w-full">
                                        Outline Button
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Motion Animations Test */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    Motion Animations
                                </CardTitle>
                                <CardDescription>Smooth animations working</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-lg text-center font-medium cursor-pointer"
                                >
                                    Hover & Click Me!
                                </motion.div>
                                <motion.div
                                    animate={{
                                        y: [0, -10, 0],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="mt-4 text-center"
                                >
                                    <Rocket className="h-8 w-8 mx-auto text-orange-500" />
                                </motion.div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Firebase Test */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, duration: 0.3 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    Firebase SDK
                                </CardTitle>
                                <CardDescription>Client initialized</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Status:</span>
                                        <span className="text-sm font-medium text-green-600">
                                            {firebaseInitialized ? "✓ Initialized" : "✗ Not initialized"}
                                        </span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Firebase config loaded: {app.options.projectId}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* lucide-react Icons Test */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7, duration: 0.3 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    lucide-react Icons
                                </CardTitle>
                                <CardDescription>Icon library working</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-around">
                                    <CheckCircle className="h-8 w-8 text-green-500" />
                                    <Rocket className="h-8 w-8 text-blue-500" />
                                    <Sparkles className="h-8 w-8 text-yellow-500" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                >
                    <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                                <div>
                                    <p className="font-semibold text-green-900 dark:text-green-100">
                                        All Skills Operational
                                    </p>
                                    <p className="text-sm text-green-700 dark:text-green-300">
                                        All libraries are installed and working correctly
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <div className="text-center text-sm text-muted-foreground mt-8">
                    <p>Skills verified: shadcn/ui, Motion, Firebase, lucide-react</p>
                    <p className="mt-1">Ready to build Million Chances Now! 🚀</p>
                </div>
            </motion.div>
        </div>
    )
}

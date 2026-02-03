import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const LandingPage = () => {
    const [dbStatus, setDbStatus] = useState('Checking connection...');

    useEffect(() => {
        const testConnection = async () => {
            try {
                if (!db) throw new Error("Firebase not initialized");
                // Just checking if we can create a reference, not necessarily reading yet if permissions are locked
                const testRef = collection(db, 'test');
                setDbStatus('Firebase SDK Initialized');
            } catch (error) {
                console.error("Firebase connection error:", error);
                setDbStatus('Connection Failed (Add Config)');
            }
        };
        testConnection();
    }, []);

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <header style={{ position: 'absolute', top: 0, left: 0, width: '100%', padding: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Million Chances</h3>
            </header>

            <main className="flex-center" style={{ flexDirection: 'column', textAlign: 'center' }}>
                <div className="glass-panel animate-fade-in" style={{ padding: '4rem', maxWidth: '800px', width: '100%' }}>
                    <h1 className="text-gradient">Every chance <br /> is a new beginning.</h1>
                    <p style={{ marginTop: '1.5rem', maxWidth: '600px', marginInline: 'auto' }}>
                        Welcome to Million Chances. A platform built to explore infinite possibilities.
                        Connect to Firestore to start your journey.
                    </p>

                    <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button className="btn-primary">Get Started</button>
                        <div className="glass-panel" style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.9rem', color: 'hsl(var(--color-text-muted))' }}>Status: </span>
                            <span style={{ marginLeft: '0.5rem', fontWeight: '600', color: dbStatus.includes('Failed') ? '#ef4444' : '#10b981' }}>
                                {dbStatus}
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;

import React, { useEffect, useState } from 'react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from 'recharts';

// TYPES
export interface RadarDataPoint {
    capability: string;
    current: number;
    target: number;
    fullMark: number;
}

interface CapabilityRadarProps {
    data: RadarDataPoint[];
    showTarget?: boolean;
    title?: string;
    colors?: {
        current?: string;
        target?: string;
    };
    height?: number;
    animated?: boolean;
}

// Helper: detect dark mode
const isDarkMode = () => document.documentElement.classList.contains('dark');

// CUSTOM TOOLTIP
const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    const dark = isDarkMode();

    return (
        <div style={{
            backgroundColor: dark ? 'rgba(15, 23, 42, 0.95)' : '#ffffff',
            border: dark ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid rgba(99, 102, 241, 0.4)',
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: dark ? '0 10px 40px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.12)',
            backdropFilter: 'blur(10px)',
        }}>
            <p style={{
                color: dark ? '#f1f5f9' : '#202124',
                fontWeight: 600,
                fontSize: '14px',
                marginBottom: '8px',
                borderBottom: dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                paddingBottom: '8px'
            }}>
                {label}
            </p>
            {payload.map((entry: any, index: number) => (
                <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '4px'
                }}>
                    <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: entry.color
                    }} />
                    <span style={{ color: dark ? '#94a3b8' : '#5f6368', fontSize: '13px' }}>
                        {entry.name}:
                    </span>
                    <span style={{ color: dark ? '#f1f5f9' : '#202124', fontWeight: 600, fontSize: '13px' }}>
                        {entry.value}/4
                    </span>
                </div>
            ))}
        </div>
    );
};


// CUSTOM LEGEND
const CustomLegend = ({ payload }: any) => {
    if (!payload) return null;

    const dark = isDarkMode();

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            marginTop: '16px',
            flexWrap: 'wrap'
        }}>
            {payload.map((entry: any, index: number) => (
                <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    backgroundColor: dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                    border: dark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.12)'
                }}>
                    <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: entry.color,
                        boxShadow: `0 0 8px ${entry.color}50`
                    }} />
                    <span style={{
                        color: dark ? '#e2e8f0' : '#202124',
                        fontSize: '13px',
                        fontWeight: 500
                    }}>
                        {entry.value}
                    </span>
                </div>
            ))}
        </div>
    );
};


// MAIN COMPONENT
export const CapabilityRadar: React.FC<CapabilityRadarProps> = ({
    data,
    showTarget = true,
    title,
    colors = {
        current: '#6366f1', // Indigo
        target: '#f59e0b'   // Amber
    },
    height = 350,
    animated = true
}) => {
    const [isVisible, setIsVisible] = useState(!animated);
    const [dark, setDark] = useState(isDarkMode());

    useEffect(() => {
        if (animated) {
            const timer = setTimeout(() => setIsVisible(true), 100);
            return () => clearTimeout(timer);
        }
    }, [animated]);

    // Listen for theme changes
    useEffect(() => {
        const observer = new MutationObserver(() => {
            setDark(isDarkMode());
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    // Resolve CSS variables to actual colors (Recharts needs hex/rgb)
    const resolveColor = (color: string): string => {
        if (color.startsWith('var(')) {
            const varName = color.match(/var\(([^)]+)\)/)?.[1];
            const fallbacks: Record<string, string> = {
                '--md-sys-color-primary': '#6366f1',
                '--md-sys-color-secondary': '#8b5cf6',
                '--md-sys-color-tertiary': '#ec4899',
            };
            return fallbacks[varName || ''] || '#6366f1';
        }
        return color;
    };

    const currentColor = resolveColor(colors.current || '#6366f1');
    const targetColor = resolveColor(colors.target || '#f59e0b');

    // Theme-aware chart colors
    const gridStroke = dark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(0, 0, 0, 0.12)';
    const axisTickFill = dark ? '#94a3b8' : '#5f6368';
    const radiusTickFill = dark ? '#64748b' : '#80868b';
    const dotStroke = dark ? '#1e293b' : '#ffffff';
    const titleColor = dark ? '#e2e8f0' : '#202124';
    const emptyTextColor = dark ? '#94a3b8' : '#5f6368';

    if (!data || data.length === 0) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: height,
                color: emptyTextColor,
                fontSize: '14px'
            }}>
                No data available
            </div>
        );
    }

    return (
        <div style={{
            width: '100%',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'scale(1)' : 'scale(0.95)',
            transition: 'opacity 0.5s ease, transform 0.5s ease'
        }}>
            {title && (
                <h3 style={{
                    textAlign: 'center',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: titleColor,
                    marginBottom: '16px',
                    letterSpacing: '-0.01em'
                }}>
                    {title}
                </h3>
            )}

            <ResponsiveContainer width="100%" height={height}>
                <RadarChart
                    data={data}
                    margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
                >
                    {/* Background Grid */}
                    <PolarGrid
                        stroke={gridStroke}
                        strokeWidth={1}
                        gridType="polygon"
                    />

                    {/* Capability Labels */}
                    <PolarAngleAxis
                        dataKey="capability"
                        tick={{
                            fill: axisTickFill,
                            fontSize: 11,
                            fontWeight: 500
                        }}
                        tickLine={false}
                    />

                    {/* Score Scale (0-4) */}
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 4]}
                        tick={{
                            fill: radiusTickFill,
                            fontSize: 10
                        }}
                        tickCount={5}
                        axisLine={false}
                    />

                    {/* Target Radar (Background - Dashed) */}
                    {showTarget && (
                        <Radar
                            name="Target"
                            dataKey="target"
                            stroke={targetColor}
                            fill={targetColor}
                            fillOpacity={0.15}
                            strokeWidth={2}
                            strokeDasharray="6 4"
                            animationBegin={animated ? 300 : 0}
                            animationDuration={animated ? 800 : 0}
                            animationEasing="ease-out"
                        />
                    )}

                    {/* Current Radar (Foreground - Solid) */}
                    <Radar
                        name="Current"
                        dataKey="current"
                        stroke={currentColor}
                        fill={currentColor}
                        fillOpacity={0.4}
                        strokeWidth={2.5}
                        dot={{
                            r: 4,
                            fill: currentColor,
                            stroke: dotStroke,
                            strokeWidth: 2
                        }}
                        activeDot={{
                            r: 6,
                            fill: currentColor,
                            stroke: dark ? '#fff' : '#ffffff',
                            strokeWidth: 2
                        }}
                        animationBegin={animated ? 100 : 0}
                        animationDuration={animated ? 1000 : 0}
                        animationEasing="ease-out"
                    />

                    {/* Custom Tooltip */}
                    <Tooltip content={<CustomTooltip />} />

                    {/* Custom Legend */}
                    <Legend content={<CustomLegend />} />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CapabilityRadar;
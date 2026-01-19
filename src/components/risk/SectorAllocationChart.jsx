import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Card from '../ui/Card';
import { sectorAllocation } from '../../lib/mockData';

export default function SectorAllocationChart() {
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-800 border border-slate-700 rounded-md p-3 shadow-xl">
                    <p className="text-slate-300 text-sm font-medium">{payload[0].name}</p>
                    <p className="text-white text-lg font-mono font-bold">
                        {payload[0].value}%
                    </p>
                </div>
            );
        }
        return null;
    };

    const renderLabel = (entry) => {
        return `${entry.name} ${entry.value}%`;
    };

    return (
        <Card>
            <h2 className="text-xl font-bold text-white mb-6">Sector Allocation</h2>

            <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                    <Pie
                        data={sectorAllocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                        label={renderLabel}
                        labelLine={{ stroke: '#64748b', strokeWidth: 1 }}
                    >
                        {sectorAllocation.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>

            <div className="mt-6 grid grid-cols-2 gap-3">
                {sectorAllocation.map((sector) => (
                    <div key={sector.name} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-sm flex-shrink-0"
                            style={{ backgroundColor: sector.color }}
                        ></div>
                        <span className="text-sm text-slate-300">{sector.name}</span>
                        <span className="text-sm font-mono font-semibold text-slate-400 ml-auto">
                            {sector.value}%
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
}

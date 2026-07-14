import { cn } from '@/src/lib/utils';
import React from 'react';

type FeatureType = {
	title: string;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	description: string;
	active?: boolean;
	isSoon?: boolean;
};

type FeatureCardProps = React.ComponentProps<'div'> & {
	feature: FeatureType;
};

export function FeatureCard({ feature, className, ...props }: FeatureCardProps) {
	const isDisabled = feature.active === false || feature.isSoon;

	return (
		<div className={cn(
			'relative overflow-hidden p-8 group transition-all', 
			!isDisabled && 'hover:bg-theme-accent/[0.02]', 
			isDisabled && 'opacity-60',
			className
		)} {...props}>
			<div className={cn("relative z-10 h-full flex flex-col")}>
				<feature.icon className={cn("text-theme-accent size-7 mb-6 transition-transform", !isDisabled && "group-hover:scale-110")} strokeWidth={1.5} aria-hidden />
				<h3 className="text-lg font-bold text-theme-main tracking-tight">{feature.title}</h3>
				<p className="text-theme-textDim mt-2 text-sm leading-relaxed font-medium flex-grow">{feature.description}</p>
				<div className={cn(
					"mt-6 flex items-center gap-2 font-bold text-sm transition-all",
					isDisabled ? "text-theme-textDim cursor-not-allowed" : "text-theme-accent group/btn"
				)}>
					{isDisabled ? "Belum tersedia" : "Coba fitur ini"}
					{!isDisabled && <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>}
				</div>
			</div>
		</div>
	);
}

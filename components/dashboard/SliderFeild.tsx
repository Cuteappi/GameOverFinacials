import * as React from "react"
import { AccentSlider } from "@/components/dashboard/AccentSlider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

function Row({ children }: { children: React.ReactNode }) {
	return <div className="flex items-center justify-between gap-3 py-1.5">{children}</div>
}

function SliderField(props: {
	label: string
	value: number
	min: number
	max: number
	step?: number
	format?: (n: number) => string
	onValueChange: (n: number) => void
	debounceMs?: number
}) {
	const { label, value, min, max, step = 1, onValueChange, format, debounceMs = 200 } = props
	const [editing, setEditing] = React.useState(false)
	const [text, setText] = React.useState<string>(String(value))
	const inputRef = React.useRef<HTMLInputElement>(null)
	const [sVal, setSVal] = React.useState<number>(value)
	const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

	React.useEffect(() => {
		setText(String(value))
		setSVal(value)
	}, [value])

	React.useEffect(() => {
		if (editing) inputRef.current?.select()
	}, [editing])

	function clampRound(n: number) {
		const rounded = Math.round((n - min) / step) * step + min
		return Math.max(min, Math.min(max, rounded))
	}

	const commit = () => {
		const num = Number(text)
		if (!Number.isNaN(num)) {
			onValueChange(clampRound(num))
		}
		setEditing(false)
	}

	const onSliderChange = (n: number) => {
		const next = clampRound(n)
		setSVal(next)
		if (timerRef.current) clearTimeout(timerRef.current)
		timerRef.current = setTimeout(() => {
			onValueChange(next)
			timerRef.current = null
		}, debounceMs)
	}

	React.useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current)
		}
	}, [])

	return (
		<div className="space-y-2">
			<Row>
				<Label>{label}</Label>
				{editing ? (
					<Input
						ref={inputRef}
						className="h-7 text-right min-w-[4ch] max-w-[16ch] px-2 input-accent-focus [appearance:textfield] [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
						type="number"
						inputMode="decimal"
						step={step}
						value={text}
						onChange={(e) => setText(e.target.value)}
						onBlur={commit}
						style={{ width: `${Math.max(4, String(text).length)}ch` }}
						onKeyDown={(e) => {
							if (e.key === "Enter") commit()
							if (e.key === "Escape") {
								setEditing(false)
								setText(String(value))
							}
						}}
					/>
				) : (
					<button
						type="button"
						className="text-sm text-muted-foreground select-none cursor-text px-1 py-0.5 rounded hover:bg-muted/40"
						onClick={() => setEditing(true)}
					>
						{format ? format(sVal) : sVal}
					</button>
				)}
			</Row>
			<AccentSlider
				value={[sVal]}
				min={min}
				max={max}
				step={step}
				onValueChange={(v) => onSliderChange(v[0] ?? sVal)}
			/>
			<div className="flex justify-between text-xs text-muted-foreground">
				<span>{format ? format(min) : min}</span>
				<span>{format ? format(max) : max}</span>
			</div>
		</div>
	)
}

export { SliderField }
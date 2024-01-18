export function daysUntilExpiration(timestamp: number) {
	const currentTimestamp = new Date().getTime()
	const timeDifference = timestamp - currentTimestamp
	const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
	return daysLeft
}

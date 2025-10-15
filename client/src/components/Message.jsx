export default function Message({ role, content }) {
	return (
		<div style={{ margin: '8px 0', textAlign: role === 'assistant' ? 'left' : 'right' }}>
			<div style={{
				display: 'inline-block',
				background: role === 'assistant' ? '#f1f5f9' : '#2563eb',
				color: role === 'assistant' ? '#0f172a' : 'white',
				padding: '8px 12px',
				borderRadius: 8,
				maxWidth: 560,
				whiteSpace: 'pre-wrap'
			}}>
				{content}
			</div>
		</div>
	);
}



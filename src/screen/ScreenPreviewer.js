import R from 'ramda'
import React from 'react'
import seeds, { Seed } from 'react-seeds'
import Frame from 'react-frame-component'

import Button from '../ui/Button'
import Choice from '../ui/Choice'
import * as stylers from '../stylers'
import destinations from '../destinations'

const catchRenderErrors = false

const iframeStyler = seeds({
	height: 600,
	border: 'none'
})

function DestinationChoice({
	destinationID,
	destinationDevice,
	destinations,
	onChange,
	onPhoneDestination,
	onFullDestination
}) {
	const items = R.pipe(
		R.toPairs,
		R.map(R.converge(R.merge, [
			R.pipe(
				R.prop(0),
				R.objOf('value')
			),
			R.pipe(
				R.prop(1),
				R.pick(['title'])
			)
		]))
	)(destinations)

	return (
		<Seed row width='100%'>
			<Choice
				value={ destinationID }
				items={ items }
				width='100%'
				minHeight={ 32 }
				grow={ 1 }
				border='none'
				//maxWidth='20em'
				onChange={ onChange }
				styler={ stylers.masterButton }
			/>
			<Button
				onClick={ onPhoneDestination }
				children='Phone'
				selected={ destinationDevice == 'phone' }
				styler={ stylers.masterButton }
			/>
			<Button
				onClick={ onFullDestination }
				children='Full'
				selected={ destinationDevice == 'full' }
				styler={ stylers.masterButton }
			/>
		</Seed>
	)
}

export default function PreviewSection({
	contentTree,
	ingredients,
	destinationID,
	destinationDevice,
	onChangeDestination,
	onPhoneDestination,
	onFullDestination
}) {
	const { head: renderHead, Preview } = destinations[destinationID]

	return (
		<Seed column alignItems='center'
			{ ...stylers.previewColumn({ destinationDevice }) }
		>
			<Seed key={ destinationID }
				column
				grow={ 1 } width='100%'
			>
			{
				!!contentTree ? (
					false ? (
						R.tryCatch(
							(contentTree) => (
								<Preview
									ingredients={ ingredients }
									contentTree={ contentTree }
								/>
							),
							(error, contentTree) => console.error('Invalid tree', error, contentTree)
						)(contentTree)
					) : (
						<Frame
							head={ renderHead() }
							{ ...iframeStyler }
						>
							<Preview
								ingredients={ ingredients }
								contentTree={ contentTree }
							/>
						</Frame>
					)	
				) : null
			}
			</Seed>
			<DestinationChoice
				destinationID={ destinationID }
				destinationDevice={ destinationDevice }
				destinations={ destinations }
				onChange={ onChangeDestination }
				onPhoneDestination={ onPhoneDestination }
				onFullDestination={ onFullDestination }
			/>
		</Seed>
	)
}
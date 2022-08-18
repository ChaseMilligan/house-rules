import { Box, Heading, Layer } from 'grommet';
import { LinkPrevious } from 'grommet-icons';
import { useState, useEffect } from 'react';
import Loading from './Loading';
import QRCode from 'qrcode';

export default function QrModal(props) {
	const [loading, setLoading] = useState(false);
	const url = window.location.href + `?room=${props.roomCode}`;
	const [qrcode, setQrcode] = useState('');

	function GenerateQRCode() {
		setLoading(true);
		QRCode.toDataURL(url, (err, url) => {
			if (err) {
				console.log(err);
				setLoading(false);
				return err;
			}
			console.log(url);
			setQrcode(url);
			setLoading(false);
		});
	}

	useEffect(() => {
		GenerateQRCode();
	}, []);

	console.log(url, props.roomCode);

	if (loading) {
		return <Loading />;
	}

	return (
		<Layer onEsc={props.onModalClose} onClickOutside={props.onModalClose}>
			<Box overflow="scroll" padding="1em">
				<Box margin="1em 1em" flex="grow" direction="row" align="center">
					<LinkPrevious color="dark-6" onClick={props.onModalClose} />
					<Heading margin="0px .5em" level="2">
						QR code party invite
					</Heading>
				</Box>
				<Box flex={false} pad="2em">
					<img src={qrcode} />
				</Box>
			</Box>
		</Layer>
	);
}

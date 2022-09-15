import React from 'react';
import {
	Box,
	Card,
	CardContent,
	CardHeader,
	Divider,
	Grid,
	// Link,
	TextField,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

function MontosInversion({ values, touched, errors, handleBlur, handleChange, waringGenerico }) {
	return (
		<div>
			<Card>
				<CardHeader title="Montos de inversión" />
				<Divider />
				<CardContent>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							{waringGenerico && <Alert severity="warning">{waringGenerico}</Alert>}
						</Grid>
						<Grid item md={6} xs={12}>
							<TextField
								error={Boolean(touched.cheque && errors.cheque)}
								fullWidth
								id="cheque"
								helperText={touched.cheque && errors.cheque}
								label="Cheques"
								name="cheque"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.cheque}
								variant="outlined"
								type="number"
							/>
						</Grid>
						<Grid item md={6} xs={12}>
							<TextField
								error={Boolean(touched.deposito_bancario && errors.deposito_bancario)}
								fullWidth
								id="deposito_bancario"
								helperText={touched.deposito_bancario && errors.deposito_bancario}
								label="Depósito directo"
								name="deposito_bancario"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.deposito_bancario}
								variant="outlined"
								type="number"
							/>
						</Grid>
					</Grid>
					<Box mt={2}>
						<Grid container spacing={2}>
							<Grid item md={6} xs={12}>
								<TextField
									error={Boolean(touched.traspaso && errors.traspaso)}
									fullWidth
									id="traspaso"
									helperText={touched.traspaso && errors.traspaso}
									label="Traspaso"
									name="traspaso"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.traspaso}
									variant="outlined"
									type="number"
								/>
							</Grid>
							<Grid item md={6} xs={12}>
								<TextField
									error={Boolean(touched.transferencia && errors.transferencia)}
									fullWidth
									id="traspaso"
									helperText={touched.transferencia && errors.transferencia}
									label="Transferencia"
									name="transferencia"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.transferencia}
									variant="outlined"
									type="number"
								/>
							</Grid>
						</Grid>
					</Box>
					{/* {Boolean(touched.policy && errors.policy) && <FormHelperText error>{errors.policy}</FormHelperText>} */}
				</CardContent>
			</Card>
		</div>
	);
}

MontosInversion.propTypes = {};

export default MontosInversion;

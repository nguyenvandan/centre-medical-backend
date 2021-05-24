import express from 'express';

import dossierRouter from './dossier';
import secretaryRouter from './secretary';
import dossierHistoryRouter from './dossierhistory';
import examenRouter from './examen';
import examenCentreRouter from './examencentre';
import secretaryDossierRouter from './secretarydossier';
import smsRouter from './sms';


const router = express.Router();

router.use('/dossier', dossierRouter);
router.use('/secretary', secretaryRouter);
router.use('/dossierhistory', dossierHistoryRouter);
router.use('/examen', examenRouter);
router.use('/examencentre', examenCentreRouter);
router.use('/secretarydossier', secretaryDossierRouter);
router.use('/sms', smsRouter);


export default router;

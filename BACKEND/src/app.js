const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importa cors
const estudiantesRoutes = require('./routes/estudiantesRoute');
const docentesRoutes = require('./routes/docentesRoute');
const materiasRoutes = require('./routes/materiasRoute');
const gruposRoutes = require('./routes/gruposRoute');
const calificacionesRoutes = require('./routes/calificacionesRoute');
const adminRoutes = require('./routes/adminRoute');
const periodosRoutes = require('./routes/periodosRoute');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Configura CORS para permitir solicitudes desde cualquier origen
app.use(cors());

// Rutas principales
app.use('/sigese/estudiantes', estudiantesRoutes);
app.use('/sigese/docentes', docentesRoutes);
app.use('/sigese/materias', materiasRoutes);
app.use('/sigese/grupos', gruposRoutes);
app.use('/sigese/calificaciones', calificacionesRoutes);
app.use('/sigese/admin', adminRoutes);
app.use('/sigese/periodos', periodosRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`SIGESE ACTIVO EN EL PUERTO: ${PORT}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const estudiantesRoutes = require('./routes/estudiantesRoute');
const docentesRoutes = require('./routes/docentesRoute');
const materiasRoutes = require('./routes/materiasRoute');
const gruposRoutes = require('./routes/gruposRoute');
const calificacionesRoutes = require('./routes/calificacionesRoute');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Rutas principales
app.use('/sigese/estudiantes', estudiantesRoutes);
app.use('/sigese/docentes', docentesRoutes);
app.use('/sigese/materias', materiasRoutes);
app.use('/sigese/grupos', gruposRoutes);
app.use('/sigese/calificaciones', calificacionesRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`SIGESE ACTIVO EN EL PUERTO: ${PORT}`);
});

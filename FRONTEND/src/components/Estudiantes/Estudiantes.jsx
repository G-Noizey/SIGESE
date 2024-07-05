import React, { useMemo, useEffect, useState } from 'react';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import { FaEye, FaEdit } from 'react-icons/fa';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';


function Estudiantes() {
    const [estudiantes, setEstudiantes] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchEstudiantes = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await axios.get('http://localhost:3000/sigese/estudiantes/', {
                    headers: {
                        Authorization: `${token}`
                    }
                });

                setEstudiantes(response.data);
            } catch (error) {
                console.error('Error al obtener estudiantes:', error);
                // Aquí podrías agregar un mensaje de error para el usuario
            }
        };

        fetchEstudiantes();
    }, []);


    
    const handleAgregarEstudiante = (estudiante) => {
        setEstudiantes([...estudiantes, estudiante]);
    };




    const columns = useMemo(
        () => [
            { Header: 'Matrícula', accessor: 'matricula' },
            { Header: 'Nombre', accessor: 'nombre' },
            {
                Header: 'Apellidos',
                accessor: (row) => `${row.apellidoPaterno} ${row.apellidoMaterno}`
            },
            { Header: 'Estado', accessor: 'estado' },
            { Header: 'Teléfono', accessor: 'telefono' },
            {
                Header: 'Acciones',
                Cell: ({ row }) => (
                    <div>
                        <Link to={`/estudiantes/${row.original.matricula}`}>
                            <Button variant="primary" size="sm" className="me-2">
                                <FaEye /> Ver más
                            </Button>
                        </Link>
                        <Button variant="primary" size="sm">
                            <FaEdit /> Editar
                        </Button>
                    </div>
                )
            }
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        state: { pageIndex, pageSize, globalFilter },
        setGlobalFilter,
        nextPage,
        previousPage,
        canPreviousPage,
        canNextPage,
        pageOptions,
        gotoPage,
        pageCount,
        setPageSize
    } = useTable(
        {
            columns,
            data: estudiantes,
            initialState: { pageIndex: 0, pageSize: 10 }
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

   
const handleSubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const estudianteData = {
      matricula: formData.get('matricula'),
      nombre: formData.get('nombre'),
      apellidoPaterno: formData.get('apellidoPaterno'),
      apellidoMaterno: formData.get('apellidoMaterno'),
      genero: formData.get('genero'),
      fechaNacimiento: formData.get('fechaNacimiento'),
      direccion: formData.get('direccion'),
      telefono: formData.get('telefono'),
      correoElectronico: formData.get('correoElectronico'),
      contrasena: formData.get('contrasena'),
      idGrupo: formData.get('idGrupo'),
      estado: formData.get('estado'),
      idPeriodo: formData.get('idPeriodo'),
  };

  try {
      const token = localStorage.getItem('token');

      const response = await axios.post('http://localhost:3000/sigese/estudiantes/', estudianteData, {
          headers: {
              Authorization: `${token}`
          }
      });

      console.log('Estudiante creado:', response.data);
      handleAgregarEstudiante(response.data); // Agrega el nuevo estudiante a la lista
      setShowModal(false); // Cierra el modal después de agregar

      // Mostrar alerta de éxito
      Swal.fire({
          icon: 'success',
          title: 'Estudiante creado',
          text: 'El estudiante ha sido creado exitosamente.'
      });

  } catch (error) {
      console.error('Error al crear estudiante:', error);
      // Mostrar alerta de error
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al crear el estudiante. Por favor, intenta de nuevo.'
      });
  }
};

    return (
        <Container fluid>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <Button
                    variant="primary"
                    style={{ backgroundColor: '#165899', color: 'white', fontFamily: 'Ropa Sans', width: '200px' }}
                    onClick={() => setShowModal(true)}
                >
                    Añadir
                </Button>
                <div style={{ marginLeft: 'auto', marginRight: '10px', fontFamily: 'Ropa Sans' }}>
                    <label htmlFor="globalFilter" style={{ marginRight: '10px' }}>
                        Filtrar:
                    </label>
                    <input
                        type="text"
                        value={globalFilter || ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Buscar..."
                        style={{ width: '200px', padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
            </div>

            <Table striped bordered hover {...getTableProps()} style={{ marginTop: '20px' }}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())} style={{ fontFamily: 'Ropa Sans' }}>
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => (
                                    <td {...cell.getCellProps()} style={{ fontFamily: 'Ropa Sans' }}>
                                        {cell.render('Cell')}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </Table>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontFamily: 'Ropa Sans' }}>
                <div>
                    <Button variant="light" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                        {'<<'}
                    </Button>{' '}
                    <Button variant="light" onClick={() => previousPage()} disabled={!canPreviousPage}>
                        {'<'}
                    </Button>{' '}
                    <Button variant="light" onClick={() => nextPage()} disabled={!canNextPage}>
                        {'>'}
                    </Button>{' '}
                    <Button variant="light" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                        {'>>'}
                    </Button>{' '}
                </div>
                <div>
                    Página{' '}
                    <strong>
                        {pageIndex + 1} de {pageOptions.length}
                    </strong>{' '}
                    | Ir a página:{' '}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={(e) => {
                            const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
                            gotoPage(pageNumber);
                        }}
                        style={{ width: '50px', marginRight: '10px' }}
                    />
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                        }}
                    >
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                Mostrar {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

{/* Modal para agregar estudiante */}
<Modal show={showModal} onHide={() => setShowModal(false)}>
    <Modal.Header closeButton>
        <Modal.Title>Agregar Estudiante</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Form onSubmit={handleSubmit}>
            <div className="row">
                {/* Primera columna */}
                <div className="col-md-6">
                    <Form.Group controlId="formMatricula">
                        <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Matrícula</Form.Label>
                        <Form.Control type="text" name="matricula" style={{ fontFamily: 'Ropa Sans' }} />
                    </Form.Group>
                    <Form.Group controlId="formNombre">
                        <Form.Label style={{ fontFamily: 'Ropa Sans' }} >Nombre</Form.Label>
                        <Form.Control type="text" name="nombre" style={{ fontFamily: 'Ropa Sans' }} />
                    </Form.Group>
                    <Form.Group controlId="formApellidoPaterno">
                        <Form.Label style={{ fontFamily: 'Ropa Sans' }} >Apellido Paterno</Form.Label>
                        <Form.Control type="text" name="apellidoPaterno" style={{ fontFamily: 'Ropa Sans' }} />
                    </Form.Group>
                    <Form.Group controlId="formApellidoMaterno">
                        <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Apellido Materno</Form.Label>
                        <Form.Control type="text" name="apellidoMaterno" style={{ fontFamily: 'Ropa Sans' }} />
                    </Form.Group>
                    <Form.Group controlId="formGenero">
                        <Form.Label style={{ fontFamily: 'Ropa Sans' }} >Género</Form.Label>
                        <Form.Control type="text" name="genero" style={{ fontFamily: 'Ropa Sans' }} />
                    </Form.Group>
                    <Form.Group controlId="formFechaNacimiento">
                        <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Fecha de Nacimiento</Form.Label>
                        <Form.Control type="text" name="fechaNacimiento" style={{ fontFamily: 'Ropa Sans' }} />
                    </Form.Group>
                </div>
                {/* Segunda columna */}
                <div className="col-md-6">
                    <Form.Group controlId="formDireccion">
                        <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Dirección</Form.Label>
                        <Form.Control type="text" name="direccion" style={{ fontFamily: 'Ropa Sans' }} />
                    </Form.Group>
                    <Form.Group controlId="formTelefono">
                        <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Teléfono</Form.Label>
                        <Form.Control type="text" name="telefono" style={{ fontFamily: 'Ropa Sans' }} />
                    </Form.Group>
                    <Form.Group controlId="formCorreoElectronico">
                        <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Correo Electrónico</Form.Label>
                        <Form.Control type="text" name="correoElectronico" style={{ fontFamily: 'Ropa Sans' }} />
                    </Form.Group>
                    <Form.Group controlId="formContrasena">
                        <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Contraseña</Form.Label>
                        <Form.Control type="text" name="contrasena" style={{ fontFamily: 'Ropa Sans' }} />
                    </Form.Group>
                    <Form.Group controlId="formIdGrupo">
                        <Form.Label style={{ fontFamily: 'Ropa Sans' }}>Id Grupo</Form.Label>
                        <Form.Control type="text" name="idGrupo" style={{ fontFamily: 'Ropa Sans' }} />
                    </Form.Group>
                    <Form.Group controlId="formEstado">
                        <Form.Label style={{ fontFamily: 'Ropa Sans' }} >Estado</Form.Label>
                        <Form.Control type="text" name="estado" style={{ fontFamily: 'Ropa Sans' }} />
                    </Form.Group>
                    <Form.Group controlId="formIdPeriodo">
                        <Form.Label style={{ fontFamily: 'Ropa Sans' }}  >Id Periodo</Form.Label>
                        <Form.Control type="text" name="idPeriodo" style={{ fontFamily: 'Ropa Sans' }} />
                    </Form.Group>
                </div>
            </div>
            <Button variant="primary" type="submit" style={{ fontFamily: 'Ropa Sans' }}>
                Crear Estudiante
            </Button>
        </Form>
    </Modal.Body>
</Modal>





        </Container>
    );
}

export default Estudiantes;

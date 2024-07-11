import React, { useState } from 'react';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import { Table, Button } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import axios from 'axios';
import UpdateMateriaModal from './UpdateMateriaModal'; // Asegúrate de importar UpdateMateriaModal desde su ruta correcta

const MateriasTable = ({ materias }) => {
    const columns = React.useMemo(
        () => [
            {
                Header: 'Nombre de la Materia',
                accessor: 'nombre',
                sortType: 'basic',
            },
            {
                Header: 'Grupo',
                accessor: 'idGrupo',
                Cell: ({ value }) => <GroupName groupId={value} />, // Renderiza el nombre del grupo usando una función de renderizado personalizada
                sortType: 'basic',
            },
            {
                Header: 'Acciones',
                Cell: ({ row }) => (
                    <div>
                        <Button
                            variant="primary"
                            size="sm"
                            style={{ backgroundColor: '#165899', borderColor: '#165899', color: '#ffffff', marginRight: '5px' }}
                            onClick={() => handleEditClick(row.original.idGrupo)}
                        >
                            <FaEdit /> Editar
                        </Button>
                    </div>
                ),
            },
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
        setPageSize,
    } = useTable(
        {
            columns,
            data: materias,
            initialState: { pageIndex: 0, pageSize: 10 },
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    // Estado para manejar la visibilidad del modal de actualización de materia
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    // Estado para almacenar el ID de la materia seleccionada para editar
    const [selectedMateriaId, setSelectedMateriaId] = useState(null);

    // Función para manejar el clic en el botón de editar
    const handleEditClick = (id) => {
        setSelectedMateriaId(id); // Guarda el ID de la materia seleccionada
        setShowUpdateModal(true); // Abre el modal de actualización
    };

    // Función para manejar la actualización de datos después de editar una materia
    const handleUpdate = () => {
        window.location.reload(); // Recarga la página para refrescar los datos
    };

    const GroupName = ({ groupId }) => {
        const [groupName, setGroupName] = React.useState('');

        React.useEffect(() => {
            const fetchGroupName = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`http://localhost:3000/sigese/grupos/${groupId}`, {
                        headers: {
                            Authorization: token,
                        },
                    });
                    setGroupName(response.data.nombre);
                } catch (error) {
                    console.error('Error fetching group name:', error);
                }
            };

            if (groupId) {
                fetchGroupName();
            }
        }, [groupId]);

        return groupName;
    };

    return (
        <>
            {/* Componente UpdateMateriaModal para actualizar materias */}
            <UpdateMateriaModal
                showModal={showUpdateModal} // Estado para mostrar/ocultar el modal
                setShowModal={setShowUpdateModal} // Función para actualizar el estado del modal
                materiaId={selectedMateriaId} // ID de la materia seleccionada para editar
                onUpdate={handleUpdate} // Función para manejar la actualización de datos después de editar una materia
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
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
        </>
    );
};

export default MateriasTable;

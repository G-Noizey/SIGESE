import React, { useMemo, useState } from 'react';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import { FaEye, FaEdit } from 'react-icons/fa';
import { Table, Button } from 'react-bootstrap';
import UpdateEstudianteModal from './UpdateEstudianteModal';
import DetailsModal from './DetailsModal';

function EstudiantesTable({ estudiantes }) {
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedEstudianteId, setSelectedEstudianteId] = useState(null);

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
                        <Button
                            variant="primary"
                            size="sm"
                            className="me-2"
                            style={{ backgroundColor: '#165899', borderColor: '#165899', color: '#ffffff' }}
                            onClick={() => handleDetailsClick(row.original.idEstudiante)}
                        >
                            <FaEye /> Ver más
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            style={{ backgroundColor: '#165899', borderColor: '#165899', color: '#ffffff' }}
                            onClick={() => handleEditClick(row.original.idEstudiante)}
                        >
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

    const handleEditClick = (id) => {
        setSelectedEstudianteId(id);
        setShowUpdateModal(true);
    };

    const handleDetailsClick = (id) => {
        setSelectedEstudianteId(id);
        setShowDetailsModal(true);
    };

    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false);
        setSelectedEstudianteId(null);
    };

    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
        setSelectedEstudianteId(null);
    };

    return (
        <>
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

            <UpdateEstudianteModal
                show={showUpdateModal}
                handleClose={handleCloseUpdateModal}
                estudianteId={selectedEstudianteId}
                onUpdate={() => window.location.reload()} // Trigger reload or other update method
            />

            <DetailsModal
                show={showDetailsModal}
                handleClose={handleCloseDetailsModal}
                estudianteId={selectedEstudianteId}
            />
        </>
    );
}

export default EstudiantesTable;

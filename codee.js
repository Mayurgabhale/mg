<Table hover variant="dark" className="mb-0">
  <thead>
    <tr>
      <th>Rank</th>
      <th>Company</th>
      <th>Total</th>
      <th>Podium Floor</th>
      <th>2nd Floor</th>
      <th>Tower B</th>
    </tr>
  </thead>
  <tbody>
    {(filteredCompanies || []).map((company, index) => {
      const podiumCount = company?.byBuilding?.['Podium Floor'] || 0;
      const secondFloorCount = company?.byBuilding?.['2nd Floor'] || 0;
      const towerBCount = company?.byBuilding?.['Tower B'] || 0;

      return (
        <tr key={company?.name || index}>
          <td>
            <Badge bg={index < 3 ? 'warning' : 'secondary'}>
              #{index + 1}
            </Badge>
          </td>
          <td>{company?.name}</td>
          <td>
            <Badge bg="light" text="dark">{company?.total || 0}</Badge>
          </td>
          <td>{podiumCount > 0 ? <Badge bg="success">{podiumCount}</Badge> : '-'}</td>
          <td>{secondFloorCount > 0 ? <Badge bg="info">{secondFloorCount}</Badge> : '-'}</td>
          <td>{towerBCount > 0 ? <Badge bg="warning">{towerBCount}</Badge> : '-'}</td>
        </tr>
      );
    })}
  </tbody>

  {/* ✅ Totals Row */}
  <tfoot>
    <tr className="fw-bold bg-secondary text-dark">
      <td colSpan={2} className="text-end">Totals:</td>
      <td>
        <Badge bg="light" text="dark">
          {companyData?.totalCount || 0}
        </Badge>
      </td>
      <td>
        <Badge bg="success">
          {companyData?.buildingTotals?.['Podium Floor'] || 0}
        </Badge>
      </td>
      <td>
        <Badge bg="info">
          {companyData?.buildingTotals?.['2nd Floor'] || 0}
        </Badge>
      </td>
      <td>
        <Badge bg="warning">
          {companyData?.buildingTotals?.['Tower B'] || 0}
        </Badge>
      </td>
    </tr>
  </tfoot>
</Table>
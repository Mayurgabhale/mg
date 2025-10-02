<Table hover className="mb-0">
  <thead className="table-light">
    <tr>
      <th>Rank</th>
      <th>Company</th>
      <th>Podium Floor</th>
      <th>2nd Floor</th>
      <th>Tower B</th>
      <th>Total</th>
    </tr>
  </thead>
  <tbody>
    {(filteredCompanies || []).map((company, index) => (
      <tr key={company?.name || index}>
        <td>
          <Badge bg={index < 3 ? "warning" : "secondary"}>{index + 1}</Badge>
        </td>
        <td
          onClick={() => handleCompanyClick(company)}
          style={{ cursor: "pointer", textDecoration: "underline" }}
        >
          {company?.name}
        </td>
        {["Podium Floor", "2nd Floor", "Tower B"].map((floor) => (
          <td key={floor}>
            {company?.byBuilding?.[floor] > 0 ? (
              <Badge
                bg="primary"
                role="button"
                style={{ cursor: "pointer" }}
                onClick={() => handleCompanyBuildingClick(company, floor)}
              >
                {company?.byBuilding?.[floor]}
              </Badge>
            ) : "-"}
          </td>
        ))}
        <td>
          <Badge bg="light" text="dark">{company?.total || 0}</Badge>
        </td>
      </tr>
    ))}
  </tbody>
  <tfoot>
    <tr className="fw-bold table-light">
      <td colSpan={2} className="text-end">Totals:</td>
      <td>{companyData?.buildingTotals?.["Podium Floor"] || 0}</td>
      <td>{companyData?.buildingTotals?.["2nd Floor"] || 0}</td>
      <td>{companyData?.buildingTotals?.["Tower B"] || 0}</td>
      <td>{companyData?.totalCount || 0}</td>
    </tr>
  </tfoot>
</Table>
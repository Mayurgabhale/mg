not disply anything 

bpack compiled successfully
(node:29284) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.
Compiling...
Compiled with warnings.

[eslint]
src\components\CompanySummary.jsx
  Line 2:41:  'Form' is defined but never used                                                                           no-unused-vars
  Line 50:6:  React Hook useMemo has a missing dependency: 'SECTIONS'. Either include it or remove the dependency array  react-hooks/exhaustive-deps
  Line 53:9:  'availableZones' is assigned a value but never used                                                        no-unused-vars

Search for the keywords to learn more about each warning.
To ignore, add // eslint-disable-next-line to the line before.

WARNING in [eslint]
src\components\CompanySummary.jsx
  Line 2:41:  'Form' is defined but never used                                                                           no-unused-vars
  Line 50:6:  React Hook useMemo has a missing dependency: 'SECTIONS'. Either include it or remove the dependency array  react-hooks/exhaustive-deps
  Line 53:9:  'availableZones' is assigned a value but never used                                                        no-unused-vars

webpack compiled with 1 warning
Compiling...
Compiled with warnings.

[eslint]
src\components\CompanySummary.jsx
  Line 2:41:  'Form' is defined but never used                                                                           no-unused-vars
  Line 50:6:  React Hook useMemo has a missing dependency: 'SECTIONS'. Either include it or remove the dependency array  react-hooks/exhaustive-deps
  Line 53:9:  'availableZones' is assigned a value but never used                                                        no-unused-vars

Search for the keywords to learn more about each warning.
To ignore, add // eslint-disable-next-line to the line before.

WARNING in [eslint]
src\components\CompanySummary.jsx
  Line 2:41:  'Form' is defined but never used                                                                           no-unused-vars
  Line 50:6:  React Hook useMemo has a missing dependency: 'SECTIONS'. Either include it or remove the dependency array  react-hooks/exhaustive-deps
  Line 53:9:  'availableZones' is assigned a value but never used                                                        no-unused-vars

webpack compiled with 1 warning
C:\Users\W0024618\Desktop\swipeData\client\src\components\CompanySummary.jsx
import React, { useMemo, useState } from 'react';
import { Card, Button, Table, Row, Col, Form } from 'react-bootstrap';

/**
 * CompanySummary
 * Props:
 *  - details: object mapping zoneName -> array of occupant events (your liveData.details)
 *  - title (optional)
 */
export default function CompanySummary({ details = {}, title = 'Company-wise Summary' }) {
  const [section, setSection] = useState('Podium');

  // Predefined section -> predicate (case-insensitive zone name substring match)
  const SECTIONS = {
    Podium: (zone) => zone && zone.toLowerCase().includes('podium'),
    '2nd': (zone) => {
      // match typical ways to refer second floor: "2nd", "2", "second", "level 2"
      const z = (zone || '').toLowerCase();
      return z.includes('2nd') || z.includes('second') || z.includes('level 2') || /\b2\b/.test(z);
    },
    'Tower B': (zone) => zone && zone.toLowerCase().includes('tower b'),
    All: () => true
  };

  // Compute company counts for currently selected section
  const { companyList, totalCount, perZoneBreakdown } = useMemo(() => {
    const predicate = SECTIONS[section] || (() => true);
    const counts = new Map();
    const zoneBreak = {}; // optional: per-zone company distribution

    for (const [zoneName, arr] of Object.entries(details || {})) {
      if (!predicate(zoneName)) continue;
      zoneBreak[zoneName] = zoneBreak[zoneName] || {};
      for (const evt of (arr || [])) {
        const rawC = (evt.CompanyName || '').toString().trim();
        const company = rawC.length ? rawC : 'Unknown';
        counts.set(company, (counts.get(company) || 0) + 1);

        zoneBreak[zoneName][company] = (zoneBreak[zoneName][company] || 0) + 1;
      }
    }

    const companyList = Array.from(counts.entries())
      .map(([company, count]) => ({ company, count }))
      .sort((a, b) => b.count - a.count || a.company.localeCompare(b.company));

    const totalCount = companyList.reduce((s, c) => s + c.count, 0);

    return { companyList, totalCount, perZoneBreakdown: zoneBreak };
  }, [details, section]);

  // Small helper to show zone filters (for debugging/selection)
  const availableZones = useMemo(() => Object.keys(details || {}), [details]);

  return (
    <Card className="mb-3">
      <Card.Header>
        <Row className="align-items-center">
          <Col><strong>{title}</strong></Col>
          <Col xs="auto">
            <div style={{ display: 'flex', gap: 8 }}>
              {Object.keys(SECTIONS).map(s => (
                <Button
                  key={s}
                  size="sm"
                  variant={s === section ? 'warning' : 'outline-secondary'}
                  onClick={() => setSection(s)}
                >
                  {s}
                </Button>
              ))}
            </div>
          </Col>
        </Row>
        <div style={{ fontSize: 12, color: '#aaa', marginTop: 6 }}>
          Showing <strong>{section}</strong> — total occupants: <strong>{totalCount}</strong>
        </div>
      </Card.Header>

      <Card.Body>
        <Row>
          <Col md={6}>
            <Table hover size="sm" className="mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Company</th>
                  <th className="text-end">Count</th>
                </tr>
              </thead>
              <tbody>
                {companyList.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-muted">No data for this section</td>
                  </tr>
                )}
                {companyList.map((row, idx) => (
                  <tr key={row.company}>
                    <td>{idx + 1}</td>
                    <td style={{ maxWidth: 280, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.company}</td>
                    <td className="text-end">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>

          <Col md={6}>
            <div style={{ marginBottom: 8 }}>
              <strong>Zones included:</strong>
            </div>

            <div style={{ maxHeight: 260, overflowY: 'auto' }}>
              {Object.keys(perZoneBreakdown).length === 0 && (
                <div className="text-muted">No zones included</div>
              )}

              {Object.entries(perZoneBreakdown).map(([zone, companies]) => (
                <div key={zone} style={{ marginBottom: 8, padding: 8, borderRadius: 6, background: '#f8f9fa' }}>
                  <div style={{ fontWeight: 600 }}>{zone} <span style={{ fontSize: 12, color: '#666' }}>({Object.values(companies).reduce((s,c)=>s+c,0)})</span></div>
                  <div style={{ fontSize: 13 }}>
                    {Object.entries(companies).slice(0,6).map(([company, count]) => (
                      <div key={company} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                        <div style={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{company}</div>
                        <div>{count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Card.Body>

      <Card.Footer className="d-flex justify-content-between align-items-center">
        <div style={{ fontSize: 14 }}>Total (section): <strong>{totalCount}</strong></div>
        <div style={{ fontSize: 12, color: '#777' }}>Data updates from live feed / snapshot</div>
      </Card.Footer>
    </Card>
  );
}

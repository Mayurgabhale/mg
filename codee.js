 {/* Main Charts */}
        <Box display="flex" flexWrap="wrap" gap={2} mb={1} justifyContent="center">
          {chartConfigs.map(({ key, title, body }) => (
            <Box
              key={key}
              sx={{
                flex: {
                  xs: "1 1 100%",         // Mobile
                  sm: "1 1 calc(50% - 8px)", // Tablet
                  md: "1 1 calc(33.33% - 8px)", // Desktop
                },
                minWidth: 280,
                height: { xs: 350, md: 405 },
                animation: "fadeInUp 0.5s",
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  height: "100%",
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid #FFC107",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="h6"
                  align="center"
                  sx={{ color: "#FFC107", mb: 2 }}
                >
                  {title}
                </Typography>
                <Box sx={{ flex: 1, overflow: "hidden" }}>{body}</Box>
              </Paper>
            </Box>
          ))}
        </Box>

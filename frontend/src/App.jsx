import { useEffect, useState } from "react";
import axios from "axios";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend
);

function App() {

    const [sales, setSales] = useState([]);

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [regionFilter, setRegionFilter] = useState("All");
    const [monthFilter, setMonthFilter] = useState("All");


    /* =========================
       FETCH SALES DATA
    ========================= */

    useEffect(() => {

        const fetchSalesData = async () => {

            try {

                const response = await axios.get(
                    "http://localhost:5000/api/sales"
                );

                setSales(response.data);

            } catch (error) {

                console.error(
                    "Error fetching sales data:",
                    error
                );

            }

        };

        fetchSalesData();

    }, []);


    /* =========================
       FILTER SALES DATA
    ========================= */

    const filteredSales = sales.filter((item) => {

        const searchText = search.toLowerCase();

        const matchesSearch =
            item.product.toLowerCase().includes(searchText) ||
            item.customer.toLowerCase().includes(searchText);

        const matchesCategory =
            categoryFilter === "All" ||
            item.category === categoryFilter;

        const matchesRegion =
            regionFilter === "All" ||
            item.region === regionFilter;

        const itemDate = new Date(item.order_date);

        const itemMonth =
            itemDate.getFullYear() +
            "-" +
            String(
                itemDate.getMonth() + 1
            ).padStart(2, "0");

        const matchesMonth =
            monthFilter === "All" ||
            itemMonth === monthFilter;

        return (
            matchesSearch &&
            matchesCategory &&
            matchesRegion &&
            matchesMonth
        );

    });


    /* =========================
       KPI CALCULATIONS
    ========================= */

    const totalRevenue = filteredSales.reduce(
        (total, item) =>
            total +
            Number(item.quantity) *
            Number(item.price),
        0
    );

    const totalUnits = filteredSales.reduce(
        (total, item) =>
            total + Number(item.quantity),
        0
    );

    const totalOrders = filteredSales.length;

    const totalCustomers = new Set(
        filteredSales.map(
            (item) => item.customer
        )
    ).size;


    /* =========================
       FILTER OPTIONS
    ========================= */

    const uniqueCategories = [
        ...new Set(
            sales.map(
                (item) => item.category
            )
        )
    ];

    const uniqueRegions = [
        ...new Set(
            sales.map(
                (item) => item.region
            )
        )
    ];

    const uniqueMonths = [
        ...new Set(
            sales.map((item) => {

                const date =
                    new Date(item.order_date);

                return (
                    date.getFullYear() +
                    "-" +
                    String(
                        date.getMonth() + 1
                    ).padStart(2, "0")
                );

            })
        )
    ].sort();


    /* =========================
       MONTH NAME
    ========================= */

    const formatMonth = (month) => {

        if (month === "All") {
            return "All Months";
        }

        const [year, monthNumber] =
            month.split("-");

        const date = new Date(
            Number(year),
            Number(monthNumber) - 1
        );

        return date.toLocaleString(
            "default",
            {
                month: "long",
                year: "numeric"
            }
        );

    };


    /* =========================
       MONTHLY REVENUE
    ========================= */

    const monthlyRevenue = {};

    filteredSales.forEach((item) => {

        const date =
            new Date(item.order_date);

        const month =
            date.getFullYear() +
            "-" +
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const revenue =
            Number(item.quantity) *
            Number(item.price);

        if (!monthlyRevenue[month]) {
            monthlyRevenue[month] = 0;
        }

        monthlyRevenue[month] += revenue;

    });


    const monthlyLabels =
        Object.keys(monthlyRevenue).sort();

    const monthlyValues =
        monthlyLabels.map(
            (month) =>
                monthlyRevenue[month]
        );


    /* =========================
       FORMATTED MONTH LABELS
    ========================= */

    const formattedMonthlyLabels =
        monthlyLabels.map((month) => {

            const [year, monthNumber] =
                month.split("-");

            const date = new Date(
                Number(year),
                Number(monthNumber) - 1
            );

            return date.toLocaleString(
                "default",
                {
                    month: "short",
                    year: "numeric"
                }
            );

        });


    /* =========================
       CATEGORY REVENUE
    ========================= */

    const categoryRevenue = {};

    filteredSales.forEach((item) => {

        const category =
            item.category;

        const revenue =
            Number(item.quantity) *
            Number(item.price);

        if (!categoryRevenue[category]) {
            categoryRevenue[category] = 0;
        }

        categoryRevenue[category] += revenue;

    });


    const categoryLabels =
        Object.keys(categoryRevenue);

    const categoryValues =
        categoryLabels.map(
            (category) =>
                categoryRevenue[category]
        );


    /* =========================
       MONTHLY CHART
    ========================= */

    const monthlyChartData = {

        labels: formattedMonthlyLabels,

        datasets: [
            {
                label: "Revenue",

                data: monthlyValues,

                borderColor: "#2563eb",

                backgroundColor: "#2563eb",

                borderWidth: 3,

                tension: 0.3,

                fill: false,

                pointRadius: 5,

                pointHoverRadius: 8,

                pointBackgroundColor: "#2563eb",

                pointBorderColor: "#ffffff",

                pointBorderWidth: 2
            }
        ]

    };


    const monthlyChartOptions = {

        responsive: true,

        maintainAspectRatio: false,

        interaction: {
            intersect: false,
            mode: "index"
        },

        plugins: {

            legend: {

                display: true,

                labels: {
                    usePointStyle: true,
                    padding: 20
                }

            },

            tooltip: {

                backgroundColor: "#111827",

                titleColor: "#ffffff",

                bodyColor: "#ffffff",

                padding: 12,

                displayColors: false,

                callbacks: {

                    label: function (context) {

                        return (
                            " Revenue: ₹" +
                            Number(
                                context.raw
                            ).toLocaleString()
                        );

                    }

                }

            }

        },

        scales: {

            x: {

                grid: {
                    display: false
                },

                ticks: {
                    color: "#64748b"
                }

            },

            y: {

                beginAtZero: true,

                grid: {
                    color: "#e5e7eb"
                },

                ticks: {

                    color: "#64748b",

                    callback: function (value) {

                        return (
                            "₹" +
                            Number(
                                value
                            ).toLocaleString()
                        );

                    }

                }

            }

        }

    };


    /* =========================
       CATEGORY CHART
    ========================= */

    const categoryChartData = {

        labels: categoryLabels,

        datasets: [
            {
                label: "Revenue",

                data: categoryValues,

                backgroundColor: [
                    "#2563eb",
                    "#10b981",
                    "#f59e0b",
                    "#7c3aed",
                    "#ef4444"
                ],

                borderColor: "#ffffff",

                borderWidth: 3,

                hoverOffset: 8
            }
        ]

    };


    const categoryChartOptions = {

        responsive: true,

        maintainAspectRatio: false,

        cutout: "62%",

        plugins: {

            legend: {

                position: "bottom",

                labels: {

                    usePointStyle: true,

                    padding: 18

                }

            },

            tooltip: {

                backgroundColor: "#111827",

                titleColor: "#ffffff",

                bodyColor: "#ffffff",

                padding: 12,

                callbacks: {

                    label: function (context) {

                        return (
                            " " +
                            context.label +
                            ": ₹" +
                            Number(
                                context.raw
                            ).toLocaleString()
                        );

                    }

                }

            }

        }

    };


    /* =========================
       CLEAR FILTERS
    ========================= */

    const clearFilters = () => {

        setSearch("");
        setCategoryFilter("All");
        setRegionFilter("All");
        setMonthFilter("All");

    };


    return (

        <div className="dashboard">

            {/* SIDEBAR */}

            <aside className="sidebar">

                <h2>
                    BI Dashboard
                </h2>

                <nav>

                    <a href="#">
                        Dashboard
                    </a>

                    <a href="#">
                        Sales
                    </a>

                    <a href="#">
                        Analytics
                    </a>

                    <a href="#">
                        Reports
                    </a>

                </nav>

            </aside>


            {/* MAIN */}

            <main className="main-content">


                {/* HEADER */}

                <header className="header">

                    <div>

                        <h1>
                            Business Intelligence Dashboard
                        </h1>

                        <p>
                            Sales performance overview
                        </p>

                    </div>

                    <div className="header-date">
                        2026
                    </div>

                </header>


                {/* KPI CARDS */}

                <section className="kpi-grid">

                    <div className="kpi-card revenue-card">

                        <div className="kpi-icon">
                            ₹
                        </div>

                        <div className="kpi-content">

                            <p>
                                Total Revenue
                            </p>

                            <h2>
                                ₹{totalRevenue.toLocaleString()}
                            </h2>

                            <span>
                                Filtered sales revenue
                            </span>

                        </div>

                    </div>


                    <div className="kpi-card units-card">

                        <div className="kpi-icon">
                            #
                        </div>

                        <div className="kpi-content">

                            <p>
                                Total Units
                            </p>

                            <h2>
                                {totalUnits}
                            </h2>

                            <span>
                                Units sold
                            </span>

                        </div>

                    </div>


                    <div className="kpi-card orders-card">

                        <div className="kpi-icon">
                            ✓
                        </div>

                        <div className="kpi-content">

                            <p>
                                Total Orders
                            </p>

                            <h2>
                                {totalOrders}
                            </h2>

                            <span>
                                Sales transactions
                            </span>

                        </div>

                    </div>


                    <div className="kpi-card customers-card">

                        <div className="kpi-icon">
                            ●
                        </div>

                        <div className="kpi-content">

                            <p>
                                Total Customers
                            </p>

                            <h2>
                                {totalCustomers}
                            </h2>

                            <span>
                                Unique customers
                            </span>

                        </div>

                    </div>

                </section>


                {/* CHARTS */}

                <section className="chart-grid">


                    <div className="chart-card">

                        <h2>
                            Monthly Revenue
                        </h2>

                        <div className="chart-container">

                            {monthlyLabels.length > 0 ? (

                                <Line
                                    data={
                                        monthlyChartData
                                    }
                                    options={
                                        monthlyChartOptions
                                    }
                                />

                            ) : (

                                <p className="no-chart-data">
                                    No data available
                                </p>

                            )}

                        </div>

                    </div>


                    <div className="chart-card">

                        <h2>
                            Sales by Category
                        </h2>

                        <div className="chart-container category-chart">

                            {categoryLabels.length > 0 ? (

                                <Doughnut
                                    data={
                                        categoryChartData
                                    }
                                    options={
                                        categoryChartOptions
                                    }
                                />

                            ) : (

                                <p className="no-chart-data">
                                    No data available
                                </p>

                            )}

                        </div>

                    </div>

                </section>


                {/* SALES TABLE */}

                <section className="table-card">


                    <div className="table-header">

                        <div>

                            <h2>
                                Sales Transactions
                            </h2>

                            <p>
                                Search and filter sales records
                            </p>

                        </div>

                        <span className="record-count">

                            {filteredSales.length}
                            {" "}
                            Records

                        </span>

                    </div>


                    {/* FILTERS */}

                    <div className="filters">


                        {/* SEARCH */}

                        <div className="filter-group">

                            <label>
                                Search
                            </label>

                            <input
                                type="text"
                                placeholder="Search product or customer..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* CATEGORY */}

                        <div className="filter-group">

                            <label>
                                Category
                            </label>

                            <select
                                value={
                                    categoryFilter
                                }
                                onChange={(e) =>
                                    setCategoryFilter(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="All">
                                    All Categories
                                </option>

                                {uniqueCategories.map(
                                    (category) => (

                                        <option
                                            key={category}
                                            value={category}
                                        >
                                            {category}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* REGION */}

                        <div className="filter-group">

                            <label>
                                Region
                            </label>

                            <select
                                value={
                                    regionFilter
                                }
                                onChange={(e) =>
                                    setRegionFilter(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="All">
                                    All Regions
                                </option>

                                {uniqueRegions.map(
                                    (region) => (

                                        <option
                                            key={region}
                                            value={region}
                                        >
                                            {region}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* MONTH */}

                        <div className="filter-group">

                            <label>
                                Month
                            </label>

                            <select
                                value={
                                    monthFilter
                                }
                                onChange={(e) =>
                                    setMonthFilter(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="All">
                                    All Months
                                </option>

                                {uniqueMonths.map(
                                    (month) => (

                                        <option
                                            key={month}
                                            value={month}
                                        >
                                            {formatMonth(
                                                month
                                            )}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* CLEAR */}

                        <button
                            className="clear-button"
                            onClick={
                                clearFilters
                            }
                        >
                            Clear Filters
                        </button>


                    </div>


                    {/* TABLE */}

                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Date
                                    </th>

                                    <th>
                                        Product
                                    </th>

                                    <th>
                                        Category
                                    </th>

                                    <th>
                                        Customer
                                    </th>

                                    <th>
                                        Region
                                    </th>

                                    <th>
                                        Quantity
                                    </th>

                                    <th>
                                        Price
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredSales.length > 0 ? (

                                    filteredSales.map(
                                        (item) => (

                                            <tr
                                                key={
                                                    item.id
                                                }
                                            >

                                                <td>
                                                    {new Date(
                                                        item.order_date
                                                    ).toLocaleDateString()}
                                                </td>

                                                <td className="product-name">
                                                    {item.product}
                                                </td>

                                                <td>

                                                    <span className="category-badge">

                                                        {
                                                            item.category
                                                        }

                                                    </span>

                                                </td>

                                                <td>
                                                    {
                                                        item.customer
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        item.region
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        item.quantity
                                                    }
                                                </td>

                                                <td className="price">

                                                    ₹{Number(
                                                        item.price
                                                    ).toLocaleString()}

                                                </td>

                                            </tr>

                                        )
                                    )

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="no-results"
                                        >
                                            No sales records found.
                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>


                </section>


                {/* FOOTER */}

                <footer>

                    Business Intelligence Dashboard
                    {" • "}
                    React + Node.js + PostgreSQL

                </footer>


            </main>

        </div>

    );

}

export default App;
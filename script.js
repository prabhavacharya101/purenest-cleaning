const SUPABASE_URL = "https://eaadtzuekifryezyqhbr.supabase.co";
const SUPABASE_KEY = "sb_publishable_tstGVwzClg-vTwXae7O0oQ_rlS9QR03";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// =========================
// QUOTE FORM
// =========================

const quoteForm = document.getElementById("quoteForm");
const quoteSuccess = document.getElementById("formSuccess");

if (quoteForm) {

    quoteForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const submitButton = quoteForm.querySelector(
            'button[type="submit"]'
        );

        submitButton.disabled = true;
        submitButton.textContent = "Sending...";


        const formData = new FormData(quoteForm);


        const quoteData = {

            name: formData.get("name"),

            email: formData.get("email"),

            phone: formData.get("phone"),

            property: formData.get("property"),

            bedrooms: formData.get("bedrooms"),

            bathrooms: formData.get("bathrooms"),

            cleaning: formData.get("cleaning"),

            date: formData.get("date"),

            message: formData.get("message")

        };


        const { error } = await supabaseClient
            .from("Quote Requests")
            .insert([quoteData]);


        if (error) {

            console.error("Supabase error:", JSON.stringify(error, null, 2));

            alert(
                "Something went wrong while sending your quote request. Please try again."
            );

            submitButton.disabled = false;

            submitButton.textContent =
                "Request My Free Quote →";

            return;

        }


        // Success

        quoteForm.reset();

        submitButton.disabled = false;

        submitButton.textContent =
            "Request My Free Quote →";

        quoteSuccess.style.display = "block";

        quoteSuccess.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    });

}


// =========================
// CONTACT FORM
// =========================

const contactForm = document.getElementById("contactForm");
const contactSuccess = document.getElementById("contactSuccess");

if (contactForm) {

    contactForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const submitButton = contactForm.querySelector(
            'button[type="submit"]'
        );

        submitButton.disabled = true;
        submitButton.textContent = "Sending...";


        const formData = new FormData(contactForm);


        const contactData = {

            name: formData.get("name"),

            email: formData.get("email"),

            message: formData.get("message")

        };


        const { error } = await supabaseClient
            .from("Contact Messages")
            .insert([contactData]);


        if (error) {

            console.error(
            "Supabase error:",
            JSON.stringify(error, null, 2)
            );

            alert(
                "Something went wrong while sending your message. Please try again."
            );

            submitButton.disabled = false;

            submitButton.textContent =
                "Send Message →";

            return;

        }


        // Success

        contactForm.reset();

        submitButton.disabled = false;

        submitButton.textContent =
            "Send Message →";

        contactSuccess.style.display = "block";

        contactSuccess.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    });

}
// =========================
// OWNER LOGIN
// =========================

const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        const submitButton = loginForm.querySelector(
            'button[type="submit"]'
        );

        submitButton.disabled = true;
        submitButton.textContent = "Signing in...";
        submitButton.style.opacity = "0.7";

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

        if (error) {

            console.error("Login error:", error);

            loginError.textContent =
                "Incorrect email or password.";

            submitButton.disabled = false;
            submitButton.textContent = "Sign In →";
            submitButton.style.opacity = "1";            

            return;
        }

        // Login successful

        window.location.href = "dashboard.html";

    });

}
// =========================
// DASHBOARD AUTHENTICATION
// =========================

const dashboardPage =
    document.querySelector(".dashboard");

if (dashboardPage) {

    async function checkDashboardAuth() {

        const {
            data: { session }
        } = await supabaseClient.auth.getSession();

        if (!session) {

            window.location.href = "login.html";

            return;

        }

        console.log("Owner authenticated.");

    }

    checkDashboardAuth();

}
// =========================
// LOGOUT
// =========================

const logoutButton =
    document.getElementById("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener("click", async function () {

        await supabaseClient.auth.signOut();

        window.location.href = "login.html";

    });

}
// =========================
// LOAD DASHBOARD DATA
// =========================

const dashboard = document.querySelector(".dashboard");

if (dashboard) {

    async function loadDashboardData() {

        // Get quote requests
        const { data: quotes, error: quotesError } =
            await supabaseClient
                .from("Quote Requests")
                .select("*")
                .order("created_at", { ascending: false });


        if (quotesError) {

            console.error(
                "Error loading quote requests:",
                quotesError
            );

            return;

        }


        // Get contact messages
        const { data: messages, error: messagesError } =
            await supabaseClient
                .from("Contact Messages")
                .select("*")
                .order("created_at", { ascending: false });


        if (messagesError) {

            console.error(
                "Error loading contact messages:",
                messagesError
            );

            return;

        }


        // =========================
        // STATISTICS
        // =========================

        const newQuotes =
            quotes.filter(q => q.status === "new").length;

        const contactedQuotes =
            quotes.filter(q => q.status === "contacted").length;

        const bookedQuotes =
            quotes.filter(q => q.status === "booked").length;

        const completedQuotes =
            quotes.filter(q => q.status === "completed").length;


        document.getElementById("newQuotes").textContent =
            newQuotes;

        document.getElementById("contactedQuotes").textContent =
            contactedQuotes;

        document.getElementById("bookedQuotes").textContent =
            bookedQuotes;

        document.getElementById("completedQuotes").textContent =
            completedQuotes;


        // =========================
// QUOTE REQUESTS
// =========================

const quoteContainer =
    document.getElementById("quoteRequests");

const quoteSearch =
    document.getElementById("quoteSearch");

const quoteStatusFilter =
    document.getElementById("quoteStatusFilter");


function renderQuotes() {

    const searchTerm =
        quoteSearch.value.toLowerCase().trim();

    const selectedStatus =
        quoteStatusFilter.value;


    const filteredQuotes = quotes.filter(quote => {

        const matchesSearch =
            (quote.name || "").toLowerCase().includes(searchTerm) ||
            (quote.email || "").toLowerCase().includes(searchTerm) ||
            (quote.phone || "").toLowerCase().includes(searchTerm);


        const matchesStatus =
            selectedStatus === "all" ||
            (quote.status || "new") === selectedStatus;


        return matchesSearch && matchesStatus;

    });


    if (filteredQuotes.length === 0) {

        quoteContainer.innerHTML = `
            <div class="empty-state">
                <p>No matching quote requests.</p>
            </div>
        `;

        return;
    }


    quoteContainer.innerHTML =
        filteredQuotes.map(quote => `

            <div class="request-card">

                <div class="request-card-header">

                    <div>

                        <h3>
                            ${quote.name || "Unknown Customer"}
                        </h3>

                        <span>
                            ${quote.email || ""}
                        </span>

                    </div>


                    <select
                        class="status-select"
                        data-id="${quote.id}"
                    >

                        <option value="new"
                            ${quote.status === "new" ? "selected" : ""}>
                            New
                        </option>

                        <option value="contacted"
                            ${quote.status === "contacted" ? "selected" : ""}>
                            Contacted
                        </option>

                        <option value="booked"
                            ${quote.status === "booked" ? "selected" : ""}>
                            Booked
                        </option>

                        <option value="completed"
                            ${quote.status === "completed" ? "selected" : ""}>
                            Completed
                        </option>

                        <option value="cancelled"
                            ${quote.status === "cancelled" ? "selected" : ""}>
                            Cancelled
                        </option>

                    </select>

                </div>


                <div class="request-details">

                    <p>
                        <strong>Phone:</strong>
                        ${quote.phone || "Not provided"}
                    </p>

                    <div class="customer-actions">

    ${
        quote.phone
            ? `
                <a
                    href="tel:${quote.phone}"
                    class="customer-action"
                >
                    📞 Call
                </a>
            `
            : ""
    }

    ${
        quote.email
            ? `
                <a
                    href="mailto:${quote.email}"
                    class="customer-action"
                >
                    ✉ Email
                </a>
            `
            : ""
    }

</div>

                    <p>
                        <strong>Property:</strong>
                        ${quote.property || "Not provided"}
                    </p>

                    <p>
                        <strong>Bedrooms:</strong>
                        ${quote.bedrooms || "Not provided"}
                    </p>

                    <p>
                        <strong>Bathrooms:</strong>
                        ${quote.bathrooms || "Not provided"}
                    </p>

                    <p>
                        <strong>Cleaning:</strong>
                        ${quote.cleaning || "Not provided"}
                    </p>

                    <p>
                        <strong>Date:</strong>
                        ${quote.date || "Not provided"}
                    </p>

                    <p>
                        <strong>Message:</strong>
                        ${quote.message || "No message"}
                    </p>

                </div>

            </div>

        `).join("");
}


quoteSearch.addEventListener(
    "input",
    renderQuotes
);


quoteStatusFilter.addEventListener(
    "change",
    renderQuotes
);


renderQuotes();

        // =========================
        // CONTACT MESSAGES
        // =========================

        const messageContainer =
            document.getElementById("contactMessages");


        if (messages.length === 0) {

            messageContainer.innerHTML = `
                <div class="empty-state">
                    <p>No contact messages yet.</p>
                </div>
            `;

        } else {

            messageContainer.innerHTML = messages.map(message => `

                <div class="request-card">

                    <div class="request-card-header">

                        <div>

                            <h3>
                                ${message.name || "Unknown"}
                            </h3>

                            <span>
                                ${message.email || ""}
                            </span>

                        </div>

                        <span class="status-badge">
                            ${message.status || "new"}
                        </span>

                    </div>


                    <div class="request-details">

                        <p>
                            ${message.message || ""}
                        </p>

                    </div>

                </div>

            `).join("");

        }

    }


    loadDashboardData();

}
// =========================
// UPDATE QUOTE STATUS
// =========================

document.addEventListener("change", async function (event) {

    if (!event.target.classList.contains("status-select")) {
        return;
    }

    const select = event.target;

    const quoteId = select.dataset.id;

    const newStatus = select.value;


    const { error } = await supabaseClient
        .from("Quote Requests")
        .update({
            status: newStatus
        })
        .eq("id", quoteId);


    if (error) {

        console.error(
            "Status update error:",
            error
        );

        alert(
            "Could not update the status."
        );

        return;
    }


    console.log(
        "Quote status updated:",
        newStatus
    );

});
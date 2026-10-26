"use client";

import { useEffect, useRef } from "react";

type Field = {
  name: string;
  label: string;
  options: { value: string; label: string }[];
};
type Props = {
  targetId: string;
  noun: string;
  fields: Field[];
  searchLabel?: string;
};

/** Enhances server-rendered rows; all content remains readable without JavaScript. */
export function FilterBar({
  targetId,
  noun,
  fields,
  searchLabel = "Search resources",
}: Props) {
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const element = form.current!;
    const target = document.getElementById(targetId)!;
    const status = element.querySelector<HTMLElement>('[role="status"]')!;
    const empty = document.getElementById(`${targetId}-empty`);
    const controls = Array.from(
      element.querySelectorAll<HTMLInputElement | HTMLSelectElement>("[name]"),
    );
    const rows = Array.from(
      target.querySelectorAll<HTMLElement>("[data-filter-item]"),
    );
    const filterNames = controls.map((control) => control.name);
    function apply(updateUrl = true) {
      let count = 0;
      const values = Object.fromEntries(
        controls.map((control) => [control.name, control.value]),
      );
      for (const row of rows) {
        const matches = filterNames.every((name) =>
          name === "q"
            ? !values.q ||
              (row.dataset.search || row.textContent || "")
                .toLowerCase()
                .includes(values.q.trim().toLowerCase())
            : !values[name] ||
              (row.getAttribute(`data-${name}`) || "")
                .split("|")
                .includes(values[name]),
        );
        row.hidden = !matches;
        if (matches) count++;
      }
      target.hidden = count === 0;
      if (empty) empty.hidden = count !== 0;
      status.textContent = `${count} ${count === 1 ? noun : `${noun}s`} found`;
      if (updateUrl) {
        const params = new URLSearchParams(location.search);
        filterNames.forEach((name) => {
          if (values[name]) params.set(name, values[name]);
          else params.delete(name);
        });
        history.replaceState(
          null,
          "",
          location.pathname + (params.size ? `?${params}` : "") + location.hash,
        );
      }
    }
    function restore() {
      const params = new URLSearchParams(location.search);
      controls.forEach((control) => {
        const value = params.get(control.name) || "";
        if (
          control instanceof HTMLSelectElement &&
          value &&
          !Array.from(control.options).some((option) => option.value === value)
        ) {
          const option = document.createElement("option");
          option.value = value;
          option.textContent = `Unavailable selection: ${value}`;
          control.append(option);
        }
        control.value = value;
      });
      apply(false);
    }
    const input = () => apply();
    const reset = () => requestAnimationFrame(() => apply());
    restore();
    element.addEventListener("input", input);
    element.addEventListener("change", input);
    element.addEventListener("reset", reset);
    window.addEventListener("popstate", restore);
    return () => {
      element.removeEventListener("input", input);
      element.removeEventListener("change", input);
      element.removeEventListener("reset", reset);
      window.removeEventListener("popstate", restore);
      rows.forEach((row) => {
        row.hidden = false;
      });
      target.hidden = false;
      if (empty) empty.hidden = true;
    };
  }, [targetId, noun]);
  return (
    <form
      ref={form}
      className="filter-bar"
      role="search"
      aria-label={searchLabel}
      onSubmit={(event) => event.preventDefault()}
    >
      <label>
        {searchLabel}
        <input
          name="q"
          type="search"
          placeholder="Title, code or keyword"
          autoComplete="off"
          aria-controls={targetId}
        />
      </label>
      {fields.map((field) => (
        <label key={field.name}>
          {field.label}
          <select name={field.name} aria-controls={targetId}>
            <option value="">All {field.label.toLowerCase()}s</option>
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      ))}
      <button type="reset" className="filter-reset">
        Clear filters
      </button>
      <p role="status" aria-live="polite" aria-atomic="true">
        All {noun}s
      </p>
    </form>
  );
}

export function FilterEmptyState({ targetId }: { targetId: string }) {
  return (
    <div id={`${targetId}-empty`} className="empty-state" hidden>
      <h3>No matching results</h3>
      <p>Try a different search or clear the filters to see everything.</p>
    </div>
  );
}

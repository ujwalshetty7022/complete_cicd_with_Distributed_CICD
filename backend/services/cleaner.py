import pandas as pd

def clean_data(df):
    rows_before = len(df)
    duplicates = df.duplicated().sum()

    df = df.drop_duplicates()
    df = df.dropna()

    df.columns = df.columns.str.lower().str.replace(" ", "_")

    report = {
        "rows_before": rows_before,
        "rows_after": len(df),
        "duplicates_removed": int(duplicates),
        "missing_values": df.isnull().sum().to_dict()
    }

    return df, report


def suggest_cleaning(df):
    suggestions = []

    if df.isnull().sum().sum() > 0:
        suggestions.append("Dataset contains missing values")

    if df.duplicated().sum() > 0:
        suggestions.append("Dataset contains duplicate rows")

    if len(df.columns) > 10:
        suggestions.append("Dataset has many columns")

    return suggestions
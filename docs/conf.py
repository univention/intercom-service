#!/usr/bin/env python3

# SPDX-FileCopyrightText: 2022-2025 Univention GmbH
# SPDX-License-Identifier: AGPL-3.0-only

"""
Configuration file for the Sphinx documentation builder.

This file only contains a selection of the most common options. For a full
list see the documentation:
https://www.sphinx-doc.org/en/master/usage/configuration.html
"""

# included
from datetime import date
import os
import sys

# 3rd-party
import yaml

# -- Path setup --------------------------------------------------------------
#
# If extensions (or modules to document with autodoc) are in another directory,
# add these directories to sys.path here. If the directory is relative to the
# documentation root, use os.path.abspath to make it absolute, like shown here.

# -- Project information -----------------------------------------------------


def read_gitlab_config(name: str, default: str) -> str:
    """Read a variable for the documentation from the gitlab trigger definition

    To not maintain the documentation version in different places, just define
    at one place and use it in different places.

    The documentation version influences the version shown in the content of
    the document and the path of the published documentation.

    :returns: The the value for the documentation as defined in the CI/CD
        pipeline.

    :rtype: str
    """

    with open("../.gitlab-ci.yml", "r", encoding="utf-8") as file_handler:
        ci_config = yaml.safe_load(file_handler)
        try:
            value = ci_config["trigger-docs"]["variables"][name]
        except KeyError:
            value = default
    return value


def get_doc_variable(name: str, default: str) -> str:
    """Read a variable from the environment and
    as a fallback from the gitlab trigger definition

    :returns: The the value for the documentation.

    :rtype: str
    """

    try:
        return os.environ[name]
    except KeyError:
        return read_gitlab_config(name, default)


release = get_doc_variable("DOC_TARGET_VERSION", None)
version = release

project = f"UCS Intercom Service app {release}"

if "latexpdf" in sys.argv:
    project = "UCS Intercom Service app"  # pylint: disable=invalid-name

copyright = f"{date.today().year}, Univention GmbH"  # pylint: disable=redefined-builtin
author = "Univention GmbH"  # pylint: disable=invalid-name
html_show_copyright = True  # pylint: disable=invalid-name
language = "en"  # pylint: disable=invalid-name

html_title = project

# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = [
    "sphinx_copybutton",
    "sphinxcontrib.spelling",
    "univention_sphinx_extension",
    "sphinx_sitemap",
    "sphinx_last_updated_by_git",
    "sphinxcontrib.inkscapeconverter",
    "sphinx.ext.intersphinx",
    "sphinxcontrib.bibtex",
    "sphinx_inline_tabs",
]

bibtex_bibfiles = ["bibliography.bib"]
bibtex_encoding = "utf-8"  # pylint: disable=invalid-name
bibtex_default_style = "unsrt"  # pylint: disable=invalid-name
bibtex_reference_style = "label"  # pylint: disable=invalid-name

# For more configuration options of Sphinx-copybutton, see the documentation
# https://sphinx-copybutton.readthedocs.io/en/latest/index.html
copybutton_prompt_text = r"\$ |> "  # pylint: disable=invalid-name
copybutton_prompt_is_regexp = True  # pylint: disable=invalid-name

# Add any paths that contain templates here, relative to this directory.
templates_path = ["_templates"]

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns = ["_build", "Thumbs.db", ".DS_Store"]

# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.

doc_base = get_doc_variable("DOC_TARGET_NAME", "intercom-service")

html_theme = "univention_sphinx_book_theme"  # pylint: disable=invalid-name

html_theme_options = {
    "pdf_download_filename": f"{doc_base}.pdf",
    "show_source_license": True,
    "typesense_search": True,
    "typesense_document": doc_base,
    "typesense_document_version": version,
    "univention_matomo_tracking": True,
    "univention_docs_deployment": True,
}

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = []  # value is usally ['_static']

numfig = True  # pylint: disable=invalid-name

# Warnings may come up by sphinx-last-updated-by-git. Shall be suppressed to
# avoid the warnings from failing the pipeline.
suppress_warnings = ["git.too_shallow"]

if "spelling" in sys.argv:
    spelling_lang = "en"  # pylint: disable=invalid-name
    spelling_show_suggestions = True  # pylint: disable=invalid-name
    spelling_word_list_filename = ["spelling_wordlist"]

linkcheck_ignore = [
    r"https://ucs-sso-ng.example.com/admin/",
]

root_doc = "index"  # pylint: disable=invalid-name

# pylint: disable-next=invalid-name
rst_epilog = """
.. include:: /links.txt

.. include:: /abbreviations.txt
"""

intersphinx_mapping = {
    "uv-manual": ("https://docs.software-univention.de/manual/5.0/en", None),
}

latex_engine = "lualatex"  # pylint: disable=invalid-name
latex_show_pagerefs = True  # pylint: disable=invalid-name
latex_show_urls = "footnote"  # pylint: disable=invalid-name
latex_documents = [
    (
        root_doc,
        f"{doc_base}.tex",
        project,
        author,
        "manual",
        False,
    )
]
latex_elements = {
    "papersize": "a4paper",
}

# See Univention Sphinx Extension for its options.
# https://git.knut.univention.de/univention/documentation/univention_sphinx_extension
# Information about the feedback link.
univention_feedback = True  # pylint: disable=invalid-name
# Information about the license statement for the source files
univention_pdf_show_source_license = True  # pylint: disable=invalid-name
univention_doc_basename = doc_base
univention_use_doc_base = True  # pylint: disable=invalid-name
univention_project_basename = doc_base
univention_release_language_scheme = "{release}"  # pylint: disable=invalid-name
